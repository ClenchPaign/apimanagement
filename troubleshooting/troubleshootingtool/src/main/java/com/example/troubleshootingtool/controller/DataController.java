package com.example.troubleshootingtool.controller;

import com.example.troubleshootingtool.bean.Answer;
import com.example.troubleshootingtool.bean.QandA;
import com.example.troubleshootingtool.bean.Question;
import com.example.troubleshootingtool.dao.DataDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
public class DataController {

    @Autowired
    private DataDao dataDao;

    public DataController(DataDao dataDao) {
        this.dataDao = dataDao;
    }

    @RequestMapping("/api/hi")
    public String hi() {
        return "Hello world!";
    }

    @PostMapping("/insertQandA")
    public String insertDataModel(@RequestBody QandA qandA) throws Exception {
        return dataDao.insertQandA(qandA);
    }

    @GetMapping("/all")
    public List<QandA> readAll() throws IOException {
        return dataDao.getAllQandA();
    }

    @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
    public QandA getQandA(@PathVariable("id") String id) throws IOException {
        return dataDao.getQandAById(id);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    public QandA updateQandA(@PathVariable("id") String id,@RequestBody QandA qandA) throws IOException {
        return dataDao.updateQandAById(id,qandA);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public String deleteQandA(@PathVariable("id") String id) throws IOException {
        return dataDao.deleteQandAById(id);
    }

    @GetMapping("/categories")
    public List<String> getCategories() throws IOException {
        return dataDao.getAllCategories();
    }

    @RequestMapping(value = "/get_qa_cat/{cat}", method = RequestMethod.GET)
    public List<QandA> getQandAforCategory(@PathVariable("cat") String category) throws IOException {
        return dataDao.getQandAforCategory(category);
    }

    @RequestMapping(value = "/search/{keyword}", method = RequestMethod.GET)
    public List<QandA> matchQuestion(@PathVariable("keyword") String keyword) throws IOException {
        return dataDao.matchQuestion(keyword);
    }

}