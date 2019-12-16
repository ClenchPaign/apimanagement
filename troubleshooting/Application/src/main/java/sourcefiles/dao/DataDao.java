package sourcefiles.dao;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Repository;
import org.elasticsearch.client.RequestOptions;
import sourcefiles.bean.DataModel;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class DataDao {

    private RestHighLevelClient restHighLevelClient;

    private ObjectMapper objectMapper;
    public DataDao(ObjectMapper objectMapper, RestHighLevelClient restHighLevelClient) {
        this.objectMapper = objectMapper;
        this.restHighLevelClient = restHighLevelClient;
    }

    public DataModel insertData(DataModel dataModel) {
//        Map<String, Object> dataMap = objectMapper.convertValue(dataModel, Map.class);
//        String INDEX = "faq";
//        String TYPE = "question";
//        IndexRequest indexRequest = new IndexRequest(INDEX, TYPE, null)
//                .source(dataMap);
//        try {
//            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
//        } catch (ElasticsearchException e) {
//            e.getDetailedMessage();
//        } catch (java.io.IOException ex) {
//            ex.getLocalizedMessage();
//        }
        return null;
    }

    public List<DataModel> readAll() throws IOException {
        List<DataModel> users = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(100);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();

        for (int i = 8; i < searchHits.length; i++) {
            DataModel user = new ObjectMapper().readValue(searchHits[i].getSourceAsString(), DataModel.class);
            users.add(user);
        }
        return users;
    }

}


