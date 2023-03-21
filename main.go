package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func main() {
	log.Println("wellcome.....")
	http.HandleFunc("/test", IndexHandler)
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("html"))))
	//http.HandleFunc("/md/", md)
	http.Handle("/md/", http.StripPrefix("/md/", http.FileServer(http.Dir("md"))))
	http.HandleFunc("/books", cmd)
	http.HandleFunc("/file", uploadFile)
	http.HandleFunc("/paste", paste)
	http.HandleFunc("/version", version)
	http.Handle("/html/", http.StripPrefix("/html/", http.FileServer(http.Dir("html"))))
	err := http.ListenAndServe(":9999", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func hello(w http.ResponseWriter, r *http.Request) {
	log.Println(r.RequestURI)
	fmt.Fprint(w, "hello wolrd")
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	log.Println(r.RequestURI)
	t, err := template.ParseFiles("html" + r.RequestURI)

	if err != nil {
		log.Println(err)
	}

	err = t.Execute(w, nil)

	if err != nil {
		log.Println(err)

	}
}

func md(w http.ResponseWriter, r *http.Request) {
	log.Println(r.RequestURI)
	body, err := ioutil.ReadFile("." + r.RequestURI)
	if err != nil {
		log.Println(err)

	}
	bstr := string(body)
	log.Println(bstr)
	fmt.Fprint(w, bstr)
}

func version(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"status":      "available",
		"environment": "1",
		"version":     "1",
	}
	js, err := json.Marshal(data)
	if err != nil {
		log.Println(err)

	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

}

func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

func paste(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	f := q.Get("f")
	out, err := ioutil.ReadAll(r.Body)
	if err != nil {

	}
	dir := getFilePath(f) + "/images"
	e, err := pathExists(dir)
	if !e {
		os.MkdirAll(dir, os.ModePerm)
	}
	fn, err := saveB64File(dir, string(out))
	w.Write(([]byte)("![desc](images/" + fn + " \"desc\")"))
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	f := q.Get("f")
	out, err := ioutil.ReadAll(r.Body)
	if err != nil {

	}
	//log.Println(string(out))
	//log.Println("md/" + f)
	saveFile(getFilePath(f), out)

	rsp(w, LsVo{"0", "success", f, "ok"})
}

type Cmd struct {
	Command string `json:"command"`
	Path    string `json:"path"`
	Data    string `json:"data"`
	Path2   string `json:"path2"`
}

type FileVo struct {
	Name         string `json:"name"`
	Size         int64  `json:"size"`
	IsFile       bool   `json:"isFile"`
	LastModified int64  `json:"lastModified"`
}

type LsVo struct {
	Code string `json:"code"`
	Msg  string `json:"msg"`
	Data any    `json:"data"`
	Path string `json:"path"`
}

func cmd(w http.ResponseWriter, r *http.Request) {
	var input Cmd
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		return
	}
	log.Println(input.Command + ":" + input.Path + "|" + input.Data)
	if input.Command == "ls" {
		f, _ := listFile(input.Path)
		rsp(w, LsVo{"0", "success", f, input.Path})
		//mkdirs,touch,rm,mv
	} else if input.Command == "mkdirs" {
		os.MkdirAll(getFilePath(input.Path), os.ModePerm)
		rsp(w, LsVo{"0", "success", "", input.Path})
	} else if input.Command == "touch" {
		os.Create(getFilePath(input.Path))
		rsp(w, LsVo{"0", "success", "", input.Path})
	} else if input.Command == "rm" {
		err := os.RemoveAll(getFilePath(input.Path))
		if err != nil {
			log.Println(err)
		}
		rsp(w, LsVo{"0", "success", "", input.Path})
	} else if input.Command == "mv" {
		mv(getFilePath(input.Path), getFilePath(input.Data))
		rsp(w, LsVo{"0", "success", "", input.Path})
	} else if input.Command == "paste" {

	}

	//paste

}

func rsp(w http.ResponseWriter, data any) {
	//log.Println(data)
	js, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		//js = []byte("{}")

	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func saveFile(f string, data []byte) {
	err := ioutil.WriteFile(f, data, 0666)
	if err != nil {
		fmt.Println("write file failed, err: ", err)
		return
	}
}

func mv(src string, dest string) {
	err := os.Rename(src, dest)
	if err != nil {
		fmt.Println(err)
	}
}

func listFile(myfolder string) ([]FileVo, error) {

	if myfolder == "" {
		myfolder = "./md/"
	} else if myfolder == "/" {
		myfolder = "./md/"
	} else {
		myfolder = "./md" + myfolder
	}
	files, _ := ioutil.ReadDir(myfolder)

	var lf []FileVo
	for _, file := range files {
		if file.IsDir() {
			//listFile(myfolder + "/" + file.Name())
			lf = append(lf, FileVo{file.Name(), file.Size(), false, file.ModTime().Unix()})
		} else {
			lf = append(lf, FileVo{file.Name(), file.Size(), true, file.ModTime().Unix()})
			//fmt.Println(myfolder + "/" + file.Name())
		}
	}
	return lf, nil
}

func CopyFile(dstFileName string, srcFileName string) (err error) {
	source, _ := os.Open(srcFileName)
	destination, _ := os.OpenFile(dstFileName, os.O_CREATE|os.O_WRONLY, 0666)
	buf := make([]byte, 128)
	for {
		n, err := source.Read(buf)
		if err != nil && err != io.EOF {
			fmt.Println("文件没有读完")
			return err
		}
		if n == 0 {
			break
		}
		if _, err := destination.Write(buf[:n]); err != nil {
			return err
		}

	}
	return nil
}
