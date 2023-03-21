package main

import (
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/google/uuid"
)

func saveB64File(dir string, b64 string) (string, error) {
	dr := strings.Split(b64, ",")
	uf, e1 := getUpFile(dr[0])
	if e1 != nil {
		return "", e1
	}
	fd, err := base64.StdEncoding.DecodeString(dr[1])
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	os.MkdirAll(dir, os.ModePerm)
	//a := ioutil.mkdirs(path)
	name := strings.ReplaceAll(uuid.New().String(), "-", "") + "." + uf.Ext
	fn := dir + "/" + name
	saveFile(fn, fd)
	return name, nil
}

type UpFile struct {
	Type string `json:"type"`
	Ext  string `json:"ext"`
}

func getb64FileInfo(s string) (UpFile, error) {
	var uf UpFile
	p1 := strings.Split(s, ";")
	p2 := strings.Split(p1[0], ":")
	if len(p2) != 2 {
		return uf, errors.New("wrong format")
	}
	p3 := strings.Split(p2[1], "/")
	if len(p3) != 2 {
		return uf, errors.New("wrong format")
	}
	uf.Ext = p3[1]
	uf.Type = p3[0]
	return uf, nil
}
func getUpFile(s string) (UpFile, error) {
	var uf UpFile
	p1 := strings.Split(s, ";")
	p2 := strings.Split(p1[0], ":")
	if len(p2) != 2 {
		return uf, errors.New("wrong format")
	}
	p3 := strings.Split(p2[1], "/")
	if len(p3) != 2 {
		return uf, errors.New("wrong format")
	}
	uf.Ext = p3[1]
	uf.Type = p3[0]
	return uf, nil
}
