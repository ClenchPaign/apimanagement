package com.example.troubleshootingtool.dao;

import com.example.troubleshootingtool.bean.Answer;
import com.example.troubleshootingtool.bean.QandA;
import com.example.troubleshootingtool.bean.Question;
import com.example.troubleshootingtool.config.ElasticSearchConfigurationClass;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.util.*;

@Repository
public class DataDao {

    private ElasticSearchConfigurationClass elasticSearchConfigurationClass;

    private RestHighLevelClient restHighLevelClient;


    private ObjectMapper objectMapper;

    public DataDao(ElasticSearchConfigurationClass elasticSearchConfigurationClass, ObjectMapper objectMapper, RestHighLevelClient restHighLevelClient) {
        this.elasticSearchConfigurationClass = elasticSearchConfigurationClass;
        this.objectMapper = objectMapper;
        this.restHighLevelClient = restHighLevelClient;
    }

    public String insertQandA(QandA data) {
//        @PostMapping("/insertQandA")
        String uniqueID = UUID.randomUUID().toString();
        Map dataMap = objectMapper.convertValue(data, Map.class);
        String INDEX = "qa";
        data.getQuestion().setQuestionId(uniqueID);
        IndexRequest indexRequest = new IndexRequest(INDEX).source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return uniqueID + " Inserted successfully";
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return "elastic search exception "+e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return "IO exception "+ex.getLocalizedMessage()+"  "+ Arrays.toString(ex.getStackTrace());
        }
    }

    public List<QandA> getAllQandA() {
//        @GetMapping("/all")
        ArrayList<QandA> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("_index", "qa"));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();

            for (SearchHit searchHit : searchHits) {
                QandA q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QandA.class);
                System.out.println("---   :" + q_a.getQuestion().getQuestionId());
                list.add(q_a);
            }
            System.out.println("List size: --- " + list.size());
            return list;
        }catch (Exception e){
            return list;
        }
    }

    public QandA getQandAById(String id) throws IOException {
//        @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
        QandA obj = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("_id", id));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(100);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();

        for (SearchHit searchHit : searchHits) {
            obj = new ObjectMapper().readValue(searchHit.getSourceAsString(), QandA.class);
        }
        return obj;
    }

    public QandA updateQandAById(String id, QandA qandA) throws IOException {
//        @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
        Map dataMap = objectMapper.convertValue(qandA, Map.class);
        UpdateRequest updateRequest = new UpdateRequest("qa", id).doc(dataMap);
        UpdateResponse updateResponse = restHighLevelClient.update(updateRequest, RequestOptions.DEFAULT);
        return qandA;
    }

    public String deleteQandAById(String id) throws IOException {
//        @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
        DeleteRequest deleteRequest = new DeleteRequest("qa", id);
        DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
        return "Deleted successfully";
    }

    public List<String> getAllCategories() throws IOException {
//        @GetMapping("/categories")
        List<String> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        AggregationBuilder aggregationBuilder = AggregationBuilders.terms("db").field("Question.category.keyword").size(10000);

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.aggregation(aggregationBuilder);
        searchRequest.source(searchSourceBuilder);
        SearchResponse response = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        Terms terms = response.getAggregations().get("db");
        for (Terms.Bucket bucket : terms.getBuckets()) {
            list.add(bucket.getKeyAsString());
        }
        return list;
    }

    public List<QandA> getQandAforCategory(String category) throws IOException {
//        @RequestMapping(value = "/get_qa_cat/{cat}", method = RequestMethod.GET)
        ArrayList<QandA> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("Question.category", category));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            QandA q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QandA.class);
            System.out.println(q_a.getQuestion().getCategory());
            list.add(q_a);
        }
        return list;
    }

    public List<QandA> matchQuestion(String keyword) throws IOException {
//        @RequestMapping(value = "/search/{keyword}", method = RequestMethod.GET)
        ArrayList<QandA> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.wildcardQuery("Question.question.keyword", "*" + keyword + "*"));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            QandA q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QandA.class);
            list.add(q_a);
        }
        return list;
    }


}


