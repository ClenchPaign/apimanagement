package com.example.troubleshootingtool.dao;

import com.example.troubleshootingtool.bean.*;
import com.example.troubleshootingtool.config.ElasticSearchConfigurationClass;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.lucene.search.BooleanQuery;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
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
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.index.query.QueryBuilders.*;

@Repository
public class DataDao {

    private ElasticSearchConfigurationClass elasticSearchConfigurationClass;

    private RestHighLevelClient restHighLevelClient;
    String INDEX = "qa";
    HttpServletRequest httpServletRequest;
    HttpSession httpSession;

    private ObjectMapper objectMapper;

    public DataDao(ElasticSearchConfigurationClass elasticSearchConfigurationClass, ObjectMapper objectMapper, RestHighLevelClient restHighLevelClient) {
        this.elasticSearchConfigurationClass = elasticSearchConfigurationClass;
        this.objectMapper = objectMapper;
        this.restHighLevelClient = restHighLevelClient;
    }

    public String insertQAEntry(QAEntry data) {
//        @PostMapping("/insertQAEntry")
        String uniqueID = UUID.randomUUID().toString();
        data.getQuestion().setId(uniqueID);
        Map dataMap = objectMapper.convertValue(data, Map.class);
        IndexRequest indexRequest = new IndexRequest(INDEX).source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return uniqueID + " Inserted successfully";
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return "elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
    }

    public List<QAEntry> getAllQAEntry() {
//        @GetMapping("/all")
        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("_index", INDEX));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();

            for (SearchHit searchHit : searchHits) {
                QAEntry q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
                System.out.println("---   :" + q_a.getQuestion().getId());
                list.add(q_a);
            }
            System.out.println("List size: --- " + list.size());
            return list;
        } catch (Exception e) {
            return list;
        }
    }

    public QAEntry getQAEntryById(String id) throws IOException {
//        @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
        QAEntry obj = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("Question.id.keyword", id));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(100);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();

        for (SearchHit searchHit : searchHits) {
            obj = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
        }
        return obj;
    }


    public String getDocumentIDforQAEntry(String id) throws IOException {
//        @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
        String obj = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("Question.id.keyword", id));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(100);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            obj = searchHit.getId();
        }
        return obj;
    }

    public QAEntry updateQAEntryById(String id, QAEntry qandA) throws IOException {
//        @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
        Map dataMap = objectMapper.convertValue(qandA, Map.class);
        UpdateRequest updateRequest = new UpdateRequest(INDEX, getDocumentIDforQAEntry(id)).doc(dataMap);
        try {
            UpdateResponse updateResponse = restHighLevelClient.update(updateRequest, RequestOptions.DEFAULT);
            return qandA;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String deleteQAEntryById(String id) throws IOException {
//        @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
        DeleteRequest deleteRequest = new DeleteRequest(INDEX, getDocumentIDforQAEntry(id));
        try {
            DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
            return "Deleted successfully";
        } catch (Exception e) {
            return "Deletion unsuccessful  " + e.toString();
        }
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

    public List<String> getAllTags() throws IOException {
//        @GetMapping("/categories")
        List<String> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        AggregationBuilder aggregationBuilder = AggregationBuilders.terms("db").field("tags.keyword").size(10000);
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

    public List<QAEntry> getQAEntryforCategory(String category) throws IOException {
//        @RequestMapping(value = "/get_qa_cat/{cat}", method = RequestMethod.GET)
        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.termQuery("Question.category.keyword", category));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            QAEntry q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
            System.out.println(q_a.getQuestion().getCategory());
            list.add(q_a);
        }
        return list;
    }

    public List<QAEntry> matchQuestion(String keyword) throws IOException {
//        @RequestMapping(value = "/search/{keyword}", method = RequestMethod.GET)
        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.wildcardQuery("Question.question.keyword", "*" + keyword + "*"));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            QAEntry q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
            list.add(q_a);
        }
        return list;
    }

    public List<QAEntry> searchQuery(SearchQuery searchQuery) throws IOException {

        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();

        if (!searchQuery.getCategory().equals("")) {
//            TermQueryBuilder queryBuilders = termQuery("Question.category.keyword", searchQuery.getCategory());
            boolQueryBuilder.filter(termQuery("Question.category.keyword", searchQuery.getCategory()));
        }

//        boolQueryBuilder.filter(termQuery("tags.keyword", searchQuery.getTags().toString()));
        if (searchQuery.getTags().size() > 0) {
            for (int i = 0; i < searchQuery.getTags().size(); i++) {
                boolQueryBuilder.filter(QueryBuilders.wildcardQuery("tags.keyword", "*" + searchQuery.getTags().get(i) + "*"));
                System.out.println("--------------------------------------------------------------");
            }
        }
        if (searchQuery.getKeyword().size() > 0) {
            for (int i = 0; i < searchQuery.getKeyword().size(); i++) {
//                boolQueryBuilder.filter(QueryBuilders.wildcardQuery("*"+"Question.question.keyword"+"*",  searchQuery.getKeyword().get(i)));
                boolQueryBuilder.filter(QueryBuilders.queryStringQuery("*" + searchQuery.getKeyword().get(i) + "*"));
            }
        }
//        if (searchQuery.getKeyword().size() > 0) {
//            for (int i = 0; i < searchQuery.getKeyword().size(); i++) {
//                boolQueryBuilder.filter(QueryBuilders.wildcardQuery("*"+"Question.description.keyword"+"*", searchQuery.getKeyword().get(i)));
//            }
//        }
        searchSourceBuilder.query(boolQueryBuilder);
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            try {
                QAEntry q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
                list.add(q_a);
            } catch (Exception e) {
            }
        }
        if (searchQuery.getCategory().equals("") && searchQuery.getKeyword().size() == 0 && searchQuery.getTags().size() == 0) {
            list.clear();
        }
        return list;
    }

    public String restore(List<QAEntry> list) throws IOException {
        for (QAEntry qaEntry : list) {
            Map dataMap = objectMapper.convertValue(qaEntry, Map.class);
            IndexRequest indexRequest = new IndexRequest(INDEX).source(dataMap);
            try {
                IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            } catch (ElasticsearchException e) {
                e.getDetailedMessage();
                return "elastic search exception " + e.getDetailedMessage();
            } catch (IOException ex) {
                ex.getLocalizedMessage();
                return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
            }
        }

        return "Inserted successfully";
    }

    public String uploadFiles(ImageModel file) throws IOException {
        String uniqueID = UUID.randomUUID().toString();
        file.setId(uniqueID);
        Map dataMap = objectMapper.convertValue(file, Map.class);
        IndexRequest indexRequest = new IndexRequest("others").source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return response.getId();
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return "elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
    }

    public ImageModel getFilesById(String id) throws IOException {
//        @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
        ImageModel obj = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("_id", id));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(1000);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();

        for (SearchHit searchHit : searchHits) {
            obj = new ObjectMapper().readValue(searchHit.getSourceAsString(), ImageModel.class);
        }
        return obj;
    }

    public Boolean authenticate(User user, HttpServletRequest request, HttpServletResponse response) throws NullPointerException {
        LdapContext ctx = null;
        boolean result = false;
        System.out.println("ctx   :" + ctx);

        String username = user.getUsername();
        String passwd = user.getPassword();
        try {

            ctx = context(username, passwd);
            System.out.println("ctx   :" + ctx);
            SearchControls searchCtls = new SearchControls();
            String[] returnedAtts = {"sn", "mail", "cn", "givenName", "telephoneNumber"};
            searchCtls.setReturningAttributes(returnedAtts);
            searchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            String searchFilter = "(&(objectClass=user)(mail=*))";
            String searchBase = "OU=India,DC=eur,DC=ad,DC=sag";
            NamingEnumeration<?> answer = ctx.search(searchBase, searchFilter, searchCtls);

            while (answer.hasMoreElements()) {
                SearchResult sr = (SearchResult) answer.next();
                // Print some of the attributes, catch the exception if the
                // attributes have no values
                Attributes attrs = sr.getAttributes();
                if (attrs != null) {
                    String cn = attrs.get("cn").get().toString();

                    if (cn.endsWith(username.toLowerCase())
                            || cn.endsWith(username.toUpperCase())) {
                        result = true;
                        HttpSession session = request.getSession();
                      session.setAttribute("userName",username );
                        session.setAttribute("password",passwd );
                        httpServletRequest = request;
                        httpSession = request.getSession();
                        System.out.println("session   :"+session.getAttribute("userName"));
                        break;
                    } else
                        result = false;
                }
            }
        } catch (Exception e) {
            System.out.println("Provide valid username or password");
        } finally {
            try {
                if (ctx.equals(null))
                    System.out.println("\"There is no such user");

                ctx.close();
            } catch (NamingException e) {
                System.out.println("Provide valid username or password");
            }
        }
        System.out.println("RESULT:" + result);

        return result;
    }

    public LdapContext context(String user, String passwd) throws NamingException {

        Hashtable<String, String> env = new Hashtable<String, String>();
        String adminName = "CN=" + user
                + ",OU=User,OU=India,DC=eur,DC=ad,DC=sag";
        System.out.println("name :" + adminName);
        String adminPassword = passwd;
        String ldapURL = "ldap://hqdc.eur.ad.sag:3268";
        env.put(Context.INITIAL_CONTEXT_FACTORY,
                "com.sun.jndi.ldap.LdapCtxFactory");

        // connect to my domain controller
        env.put(Context.PROVIDER_URL, ldapURL);
        // set security credentials
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, adminName);
        env.put(Context.SECURITY_CREDENTIALS, adminPassword);

        // Create the initial directory context
//		DirContext ctx = new InitialLdapContext(env, null);

        LdapContext ctx = new InitialLdapContext(env, null);
        System.out.println("ctx   :" + ctx.getEnvironment().values());
        return ctx;
    }


    public Boolean logout() {

        boolean result = false;
        try {
//            HttpSession session = httpServletRequest.getSession(true);
            System.out.println("session in logout  :" + httpSession);

            if (httpSession != null) {
                httpSession.invalidate();
                result = true;
            } else {
                result = false;
            }
        }
        catch (Exception e){
            return result;
        }
//        System.out.println("session   :"+session.getAttribute("userName"));
        return result;
    }
}


