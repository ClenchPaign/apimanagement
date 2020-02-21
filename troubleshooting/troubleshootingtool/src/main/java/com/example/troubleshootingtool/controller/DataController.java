package com.example.troubleshootingtool.controller;

import com.example.troubleshootingtool.bean.*;
import com.example.troubleshootingtool.bean.*;
import com.example.troubleshootingtool.dao.DataDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SealedObject;
import java.io.File;
import java.io.FileReader;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Hashtable;
import java.util.List;

@RestController
@CrossOrigin
public class DataController {

    @Autowired
    private DataDao dataDao;
    private static String UPLOADED_FOLDER = "F://temp//";


    public DataController(DataDao dataDao) {
        this.dataDao = dataDao;
    }

    @RequestMapping("/api/hi")
    public String hi() {
        return "Hello world!";
    }

    //    @GetMapping("/all")
    @GetMapping("/qnas")
    public List<QAEntry> readAll() throws IOException {
        return dataDao.getAllQAEntry();
    }

    //    @PostMapping("/insertQandA")
    @PostMapping("/qnas")
    public String insertDataModel(@RequestBody QAEntry qandA) throws Exception {
        return dataDao.insertQAEntry(qandA);
    }

    //    @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
    @RequestMapping(value = "/qnas/{id}", method = RequestMethod.GET)
    public QAEntry getQandA(@PathVariable("id") String id) throws IOException {
        return dataDao.getQAEntryById(id);
    }

    //    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @RequestMapping(value = "/qnas/{id}", method = RequestMethod.PUT)
    public QAEntry updateQandA(@PathVariable("id") String id, @RequestBody QAEntry qandA) throws IOException {
        return dataDao.updateQAEntryById(id, qandA);
    }

    //    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @RequestMapping(value = "/qnas/{id}", method = RequestMethod.DELETE)
    public String deleteQandA(@PathVariable("id") String id) throws IOException {
        return dataDao.deleteQAEntryById(id);
    }

    @GetMapping("/categories")
    public List<String> getCategories() throws IOException {
        return dataDao.getAllCategories();
    }

    @GetMapping("/tags")
    public List<String> getAllTags() throws IOException {
        return dataDao.getAllTags();
    }

    //    @RequestMapping(value = "/get_qa_cat/{cat}", method = RequestMethod.GET)
    @RequestMapping(value = "/categories/{cat}", method = RequestMethod.GET)
    public List<QAEntry> getQandAforCategory(@PathVariable("cat") String category) throws IOException {
        return dataDao.getQAEntryforCategory(category);
    }

//    @RequestMapping(value = "/search/{keyword}", method = RequestMethod.GET)
//    public List<QAEntry> matchQuestion(@PathVariable("keyword") String keyword) throws IOException {
//        return dataDao.matchQuestion(keyword);
//    }

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public List<QAEntry> searchQuestion(@RequestBody SearchQuery searchQuery) throws IOException {
        return dataDao.searchQuery(searchQuery);
    }

    @RequestMapping(value = "/restore", method = RequestMethod.POST)
    public String restoreValues(@RequestBody List<QAEntry> qaEntryList) throws IOException {
        return dataDao.restore(qaEntryList);
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public String upload(@RequestBody ImageModel file) throws IOException {
        System.out.println("File :"+file);
        return dataDao.uploadFiles(file);
    }

    @RequestMapping(value = "/files/{id}", method = RequestMethod.GET)
    public ImageModel getFiles(@PathVariable("id") String id) throws IOException {
        return dataDao.getFilesById(id);
    }

//

    @RequestMapping(value="/auth",method = RequestMethod.POST)
    public Boolean authenticate(@RequestBody User user,HttpServletRequest request, HttpServletResponse response) throws NullPointerException,ServletException, IOException {
        return dataDao.authenticate(user,request,response);
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public Boolean logout()throws NullPointerException,ServletException, IOException {
        return dataDao.logout();
    }
}
