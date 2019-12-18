package sourcefiles.bean.controller;

import sourcefiles.bean.DataModel;
import sourcefiles.bean.dao.DataDao;
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

    @PostMapping("/question")
    public DataModel insertBook(@RequestBody DataModel dataModel) throws Exception {
        return dataDao.insertData(dataModel);
    }

    @GetMapping("/all")
    public List<DataModel> readAll() throws IOException {
        return dataDao.readAll();
    }

    @GetMapping(value = "/answer")
    public String getAnswer() {
        return "{ \"value\": \"answer\"}";
    }

}