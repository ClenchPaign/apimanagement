package sourcefiles.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import sourcefiles.bean.DataModel;
import sourcefiles.dao.DataDao;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/api")
public class DataController {

    @Autowired
    private DataDao dataDao;

    public DataController(DataDao dataDao) {
        this.dataDao = dataDao;
    }

    @PostMapping("/question")
    public DataModel insertBook(@RequestBody DataModel dataModel) throws Exception{
        return dataDao.insertData(dataModel);
    }

    @GetMapping("/all")
    public List<DataModel> readAll() throws IOException {
        return dataDao.readAll();
    }

    @GetMapping(value="/answer")
    public String getAnswer() {
        return "{ \"value\": \"answer\"}";
    }

}