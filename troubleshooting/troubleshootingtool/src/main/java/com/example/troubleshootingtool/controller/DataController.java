package com.example.troubleshootingtool.controller;

import com.example.troubleshootingtool.bean.Answer;
import com.example.troubleshootingtool.bean.QAEntry;
import com.example.troubleshootingtool.bean.Question;
import com.example.troubleshootingtool.bean.SearchQuery;
import com.example.troubleshootingtool.dao.DataDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SealedObject;
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
    public QAEntry updateQandA(@PathVariable("id") String id,@RequestBody QAEntry qandA) throws IOException {
        return dataDao.updateQAEntryById(id,qandA);
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
    public  List<QAEntry> searchQuestion(@RequestBody SearchQuery searchQuery) throws IOException {
        return dataDao.searchQuery(searchQuery);
    }

    @RequestMapping(value = "/restore", method = RequestMethod.POST)
    public  String restoreValues(@RequestBody List<QAEntry> qaEntryList) throws IOException {
        return dataDao.restore(qaEntryList);
    }


}
