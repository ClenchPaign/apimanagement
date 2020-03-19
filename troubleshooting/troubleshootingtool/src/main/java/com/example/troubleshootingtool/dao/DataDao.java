package com.example.troubleshootingtool.dao;

import com.example.troubleshootingtool.bean.*;
import com.example.troubleshootingtool.config.ElasticSearchConfigurationClass;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.admin.cluster.repositories.put.PutRepositoryRequest;
import org.elasticsearch.action.admin.cluster.snapshots.create.CreateSnapshotRequest;
import org.elasticsearch.action.admin.cluster.snapshots.create.CreateSnapshotResponse;
import org.elasticsearch.action.admin.cluster.snapshots.get.GetSnapshotsRequest;

import org.elasticsearch.action.admin.cluster.snapshots.get.GetSnapshotsResponse;
import org.elasticsearch.action.admin.cluster.snapshots.restore.RestoreSnapshotRequest;
import org.elasticsearch.action.admin.cluster.snapshots.restore.RestoreSnapshotResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.repositories.fs.FsRepository;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Repository;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

import static org.elasticsearch.index.query.QueryBuilders.*;

@Repository
public class DataDao {

    String ADMIN = "admin";
    String CATEGORY = "category";
    ElasticSearchConfigurationClass elasticSearchConfigurationClass;

    private RestHighLevelClient restHighLevelClient;
    String INDEX = "approved";
    String TEMP_INDEX = "review";
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
        IndexRequest indexRequest = new IndexRequest(TEMP_INDEX).source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return uniqueID;
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return "elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
    }

    public List<QAEntry> getAllQAEntry(String index) {
//        @GetMapping("/all")
        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchQuery("_index", index));
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(10000);
        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();

            for (SearchHit searchHit : searchHits) {
                QAEntry q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
                list.add(q_a);
            }
            ArrayList<QAEntry> edited = new ArrayList<>();
            for (QAEntry qaEntry : list) {
                try {
                    qaEntry.getQuestion().toString();
                    edited.add(qaEntry);
                } catch (Exception ignored) {
                }
            }
            return edited;
        } catch (Exception e) {
            return list;
        }
    }

    public QAEntry getQAEntryById(String id, String index) throws IOException {
//        @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
        QAEntry obj = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        boolQueryBuilder.filter(QueryBuilders.termQuery("_index", index));
        boolQueryBuilder.filter(QueryBuilders.matchQuery("Question.id.keyword", id));
        searchSourceBuilder.query(boolQueryBuilder);
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(100);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();

        for (SearchHit searchHit : searchHits) {
            obj = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
        }
        assert obj != null;
        obj.setAnswerCount(obj.getAnswers().size());
        for (int i = 0; i < obj.getAnswers().size(); i++) {
            String attachment = "";
            ArrayList<ImageModel> imageModelArrayList;
            imageModelArrayList = getFilesById(obj.getAnswers().get(i).getAttachment());
            if (imageModelArrayList != null) {
                for (int j = 0; j < imageModelArrayList.size(); j++) {
                    attachment = attachment + imageModelArrayList.get(j).getId() + "**" + imageModelArrayList.get(j).getFileName();
                    if (j != imageModelArrayList.size() - 1) {
                        attachment = attachment + ",";
                    }
                }
            }
            obj.getAnswers().get(i).setAttachment(attachment);
        }

        return obj;
    }


    public String getDocumentIDforQAEntry(String id, String index) throws IOException {
//        @RequestMapping(value = "/get_qa/{id}", method = RequestMethod.GET)
        String obj = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        boolQueryBuilder.filter(QueryBuilders.termQuery("_index", index));
        boolQueryBuilder.filter(QueryBuilders.termQuery("Question.id.keyword", id));
        searchSourceBuilder.query(boolQueryBuilder);
        searchRequest.source(searchSourceBuilder);
        searchSourceBuilder.size(100);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            obj = searchHit.getId();
        }
        return obj;
    }

    public QAEntry postAnswer(QAEntry qandA) throws IOException {
//        @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
        Map dataMap = objectMapper.convertValue(qandA, Map.class);
        IndexRequest indexRequest = new IndexRequest(TEMP_INDEX).source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return qandA;
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return null;
//            return "elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return null;
//            return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
//        UpdateRequest updateRequest = new UpdateRequest(INDEX, getDocumentIDforQAEntry(id)).doc(dataMap);
//        try {
//            UpdateResponse updateResponse = restHighLevelClient.update(updateRequest, RequestOptions.DEFAULT);
//            return qandA;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
    }

    public QAEntry updateQAEntryById(String id, QAEntry qandA) throws IOException {
        Map dataMap = objectMapper.convertValue(qandA, Map.class);
        UpdateRequest updateRequest = new UpdateRequest(INDEX, getDocumentIDforQAEntry(id, INDEX)).doc(dataMap);
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
        DeleteRequest deleteRequest = new DeleteRequest(INDEX, getDocumentIDforQAEntry(id, INDEX));
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
        searchSourceBuilder.query(QueryBuilders.matchQuery("_index", INDEX));
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

    public List<QAEntry> getQAEntryforCategory(String category, int from, int size) throws IOException {
//        @RequestMapping(value = "/get_qa_cat/{cat}", method = RequestMethod.GET)
        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        boolQueryBuilder.filter(QueryBuilders.termQuery("_index", INDEX));
        boolQueryBuilder.filter(QueryBuilders.termQuery("Question.category.keyword", category));
        searchSourceBuilder.query(boolQueryBuilder);
        searchSourceBuilder.from(from);
        searchSourceBuilder.size(size);
        searchRequest.source(searchSourceBuilder);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            QAEntry q_a = new ObjectMapper().readValue(searchHit.getSourceAsString(), QAEntry.class);
            list.add(q_a);
        }
        return list;
    }


    public List<QAEntry> searchQuery(SearchQuery searchQuery, int from, int size) throws IOException {

        ArrayList<QAEntry> list = new ArrayList<>();
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
//        searchSourceBuilder.query(QueryBuilders.matchQuery("_index", INDEX));
        boolQueryBuilder.filter(termQuery("_index", INDEX));
        if (!searchQuery.getCategory().equals("")) {
//            TermQueryBuilder queryBuilders = termQuery("Question.category.keyword", searchQuery.getCategory());
            boolQueryBuilder.filter(termQuery("Question.category.keyword", searchQuery.getCategory()));
        }

//        boolQueryBuilder.filter(termQuery("tags.keyword", searchQuery.getTags().toString()));
        if (searchQuery.getTags().size() > 0) {
            for (int i = 0; i < searchQuery.getTags().size(); i++) {
                boolQueryBuilder.filter(QueryBuilders.wildcardQuery("tags.keyword", "*" + searchQuery.getTags().get(i) + "*"));
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
        searchSourceBuilder.from(from);
        searchSourceBuilder.size(size);
        searchRequest.source(searchSourceBuilder);
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
        ArrayList<QAEntry> edited = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            try {
                list.get(i).getQuestion().toString();
                edited.add(list.get(i));
            } catch (Exception e) {
//                System.out.println("exception");
            }
        }
        return edited;
    }

    public String restore(List<QAEntry> list) {
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

    public String uploadFiles(ImageModel file) {
        String uniqueID = UUID.randomUUID().toString();
        file.setId(uniqueID);
        Map dataMap = objectMapper.convertValue(file, Map.class);
        IndexRequest indexRequest = new IndexRequest("others").source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return file.getId();
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return "elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
    }

    public ArrayList<ImageModel> getFilesById(String id) throws IOException {
        if (!id.equals("")) {
            ArrayList<ImageModel> imageModelArrayList = new ArrayList<>();
            String[] files = id.split(",");
            for (int i = 0; i < files.length; i++) {
                ImageModel obj = null;
                SearchRequest searchRequest = new SearchRequest();
                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
                BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
                boolQueryBuilder.filter(QueryBuilders.termQuery("_index", "others"));
                boolQueryBuilder.filter(QueryBuilders.matchQuery("id", files[i]));
                searchSourceBuilder.query(boolQueryBuilder);
                searchSourceBuilder.size(10000);
                searchRequest.source(searchSourceBuilder);
                SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
                SearchHit[] searchHits = searchResponse.getHits().getHits();
                for (SearchHit searchHit : searchHits) {
                    obj = new ObjectMapper().readValue(searchHit.getSourceAsString(), ImageModel.class);
                    imageModelArrayList.add(obj);
                }
            }
            return imageModelArrayList;
        } else {
            return null;
        }
    }

    public User authenticate(User user, HttpServletRequest request) throws NullPointerException, NamingException, IOException {
//        user.setUsername("Divyabharathi K");
//        user.setIsAuthenticated(true);
//        user.setEmail("divyabharathi.k@softwareag.com");
//        user.setIsAdmin(searchAdmin(user.getUserID()));
        LdapContext ctx;
        String userID = user.getUserID();
        String passwd = user.getPassword();
        user.setIsAuthenticated(false);
        HttpSession session = request.getSession();
        session.setAttribute("userName", userID);
        httpServletRequest = request;
        httpSession = request.getSession();
        System.out.println("session   :" + session.getAttribute("userName").toString());
        try {
            ctx = context(userID, passwd);
            System.out.println("ctx   :" + ctx);
            SearchControls searchCtls = new SearchControls();
            String[] returnedAtts = {"sn", "mail", "cn", "givenName", "memberOf"};
            searchCtls.setReturningAttributes(returnedAtts);
            searchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            String searchFilter = "(&(objectClass=user)(mail=*)(cn=" + userID + "))";
            String searchBase = "OU=India,DC=eur,DC=ad,DC=sag";
            NamingEnumeration<?> answer = ctx.search(searchBase, searchFilter, searchCtls);

            while (answer.hasMoreElements()) {
                System.out.println("answer has more elements");
                SearchResult sr = (SearchResult) answer.next();
                String search = sr.toString();
                System.out.println("answer   :" + sr);
                Attributes attrs = sr.getAttributes();
                if (attrs != null) {
                    String cn = attrs.get("cn").get().toString();
                    if (cn.endsWith(userID.toLowerCase()) || cn.endsWith(userID.toUpperCase())) {
                        String mail = attrs.get("mail").get().toString();
                        String givenName = attrs.get("givenName").get().toString();
                        String lastname=attrs.get("sn").get().toString();
                        String username=givenName+" "+lastname;
                        user.setEmail(mail);
                        user.setUsername(username);
                        user.setIsAuthenticated(true);
                        user.setIsAdmin(searchAdmin(cn));
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Invalid username or password");
        }
        return user;
    }

    public LdapContext context(String user, String passwd) throws NamingException {

        Hashtable<String, String> env = new Hashtable<String, String>();
        String adminName = "CN=" + user + ",OU=User,OU=India,DC=eur,DC=ad,DC=sag";
        System.out.println("name :" + adminName);
        String ldapURL = "ldap://hqdc.eur.ad.sag:3268";
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        // connect to my domain controller
        env.put(Context.PROVIDER_URL, ldapURL);
        // set security credentials
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, adminName);
        env.put(Context.SECURITY_CREDENTIALS, passwd);

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
        } catch (Exception e) {
            return result;
        }
//        System.out.println("session   :"+session.getAttribute("userName"));
        return result;
    }

    public String approveQnA(String id, QAEntry qandA) throws IOException {
        qandA.setIsApproved(true);
        if (qandA.getIsAnswered()) {
            for (int i = 0; i < qandA.getAnswers().size(); i++) {
                qandA.getAnswers().get(i).setIsApproved(true);
            }
        }
        Map dataMap = objectMapper.convertValue(qandA, Map.class);
        String returnString = "";
        deleteQAEntryById(id);
        DeleteRequest deleteRequest = new DeleteRequest(TEMP_INDEX, getDocumentIDforQAEntry(id, TEMP_INDEX));
        try {
            DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
            returnString = "Removed from review successfully";
        } catch (Exception e) {
            returnString = "Remove from review unsuccessful" + e.toString();
        }
        IndexRequest indexRequest = new IndexRequest(INDEX).source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            returnString = returnString + " and Question approved successfully";
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            returnString = returnString + " elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            returnString = returnString + " IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
        return returnString;
    }


    public String insertAdmin(Admin admin) {
//        @PostMapping("/insertQAEntry")
        Map dataMap = objectMapper.convertValue(admin, Map.class);
        IndexRequest indexRequest = new IndexRequest(ADMIN).source(dataMap);
        try {
            IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            return admin.getUsername() + " Inserted successfully";
        } catch (ElasticsearchException e) {
            e.getDetailedMessage();
            return "elastic search exception " + e.getDetailedMessage();
        } catch (IOException ex) {
            ex.getLocalizedMessage();
            return "IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace());
        }
    }

    public boolean searchAdmin(String cn) throws IOException {
        Admin admins = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        boolQueryBuilder.filter(QueryBuilders.termQuery("_index", ADMIN));
        boolQueryBuilder.filter(QueryBuilders.matchQuery("user", cn));
        searchSourceBuilder.query(boolQueryBuilder);
        searchSourceBuilder.size(1);
        searchRequest.source(searchSourceBuilder);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            admins = new ObjectMapper().readValue(searchHit.getSourceAsString(), Admin.class);
        }
        try {
            if (admins.getUsername().equals(cn)) {
                return true;
            } else {
                return false;
            }
        } catch (NullPointerException e) {
            return false;
        }

    }

    public List<String> getAdmin() throws IOException {
        List<String> list = new ArrayList<>();
        Admin admins = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        boolQueryBuilder.filter(QueryBuilders.termQuery("_index", ADMIN));
        searchSourceBuilder.query(boolQueryBuilder);
        searchSourceBuilder.size(1000);
        searchRequest.source(searchSourceBuilder);
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit searchHit : searchHits) {
            admins = new ObjectMapper().readValue(searchHit.getSourceAsString(), Admin.class);
            list.add(admins.getUsername());
        }
        return list;
    }

    public String rejectQnA(String id) throws IOException {
        String returnString = "";
        System.out.println(getDocumentIDforQAEntry(id, TEMP_INDEX));
        DeleteRequest deleteRequest = new DeleteRequest(TEMP_INDEX, getDocumentIDforQAEntry(id, TEMP_INDEX));
        try {
            DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
            returnString = "Removed from review successfully";
        } catch (Exception e) {
            returnString = "Remove from review unsuccessful" + e.toString();
        }
        return returnString;
    }

    public String createRepo() throws IOException {
        PutRepositoryRequest repo = new PutRepositoryRequest();
        repo.type(FsRepository.TYPE);
        String locationKey = FsRepository.LOCATION_SETTING.getKey();
        String locationValue = "/path/to/data/backup";
        String compressKey = FsRepository.COMPRESS_SETTING.getKey();
        boolean compressValue = true;
        Settings settings = Settings.builder()
                .put(locationKey, locationValue)
                .put(compressKey, compressValue)
                .build();
        repo.settings(settings);
        repo.name("backup");
        AcknowledgedResponse res = restHighLevelClient.snapshot().createRepository(repo, RequestOptions.DEFAULT);
        boolean acknowledged = res.isAcknowledged();
        System.out.println("acknolwgd" + acknowledged);
        return "Repository created successfully";
    }

    public String getSnapshot() throws IOException {
        String[] str = {"backup_data"};
        GetSnapshotsRequest snaprequest = new GetSnapshotsRequest("backup", str);
        GetSnapshotsResponse response = restHighLevelClient.snapshot().get(snaprequest, RequestOptions.DEFAULT);
        System.out.println("snapshot : " + response);
        return response.toString();
    }

    public String CreateSnapshot() throws IOException {
        CreateSnapshotRequest req = new CreateSnapshotRequest();
        req.repository("backup");
        req.snapshot("backup_data");
        req.indices(INDEX, TEMP_INDEX, ADMIN, "others");
        CreateSnapshotResponse snapres = restHighLevelClient.snapshot().create(req, RequestOptions.DEFAULT);
        System.out.println("snapshot : " + snapres);
        return "snapshot created successfully";
    }


    public String restoreSnapshot() throws IOException {
        RestoreSnapshotRequest request = new RestoreSnapshotRequest("backup", "backup_data");
        request.indices(INDEX, TEMP_INDEX, ADMIN, "others");
        try {
            RestoreSnapshotResponse response = restHighLevelClient.snapshot().restore(request, RequestOptions.DEFAULT);
            return "Restored";
        } catch (Exception e) {
            return "Restoration failed" + e.getStackTrace();
        }
    }

    public String addCategory(Categories admin_category) throws IOException {
        System.out.println(admin_category.getCategory());

        Map dataMap = objectMapper.convertValue(admin_category, Map.class);
        IndexRequest indexRequest = new IndexRequest(CATEGORY).source(dataMap);
//        try {
        IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
        return admin_category.getCategory();
//        } catch (ElasticsearchException e) {
//            e.getDetailedMessage();
//        } catch (IOException ex) {
//            ex.getLocalizedMessage();
//        }
    }

    public List<String> getAdminCategories() throws IOException {
        List<String> list = new ArrayList<>();
        Categories cat = null;
        SearchRequest searchRequest = new SearchRequest();
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        boolQueryBuilder.filter(QueryBuilders.termQuery("_index", CATEGORY));
        searchSourceBuilder.query(boolQueryBuilder);
        searchSourceBuilder.size(1000);
        searchRequest.source(searchSourceBuilder);
        try{
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();
            for (SearchHit searchHit : searchHits) {
                cat = new ObjectMapper().readValue(searchHit.getSourceAsString(), Categories.class);
                list.add(cat.getCategory());
            }
        } catch (ElasticsearchException e) {
            list.add(e.getDetailedMessage());
            list.add(e.getLocalizedMessage());
        } catch (IOException ex) {
            list.add(ex.getMessage());
            list.add("IO exception " + ex.getLocalizedMessage() + "  " + Arrays.toString(ex.getStackTrace()));
        }

        return list;
    }


    public List<String> getLdapUsers(User user) throws IOException {
        List<String> list = new ArrayList<>();
        LdapContext ctx;
        String userID = user.getUserID();
        String passwd = user.getPassword();
        System.out.println("username" + userID);
        System.out.println("pass" + passwd);
        try {
            ctx = context(userID, passwd);
            System.out.println("ctx   :" + ctx);
            SearchControls searchCtls = new SearchControls();
            String[] returnedAtts = {"sn", "mail", "cn", "givenName", "memberOf"};
            searchCtls.setReturningAttributes(returnedAtts);
            searchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            String searchFilter = "(&(objectClass=user)(mail=*))";
            String searchBase = "OU=India,DC=eur,DC=ad,DC=sag";
            NamingEnumeration<?> answer = ctx.search(searchBase, searchFilter, searchCtls);
            while (answer.hasMoreElements()) {
                System.out.println("answer has more elements");
                SearchResult sr = (SearchResult) answer.next();
                String search = sr.toString();
                System.out.println("answer   :" + sr);
                Attributes attrs = sr.getAttributes();
                if (attrs != null) {
                    String cn = attrs.get("cn").get().toString();
                    list.add(cn);
                }
            }
        } catch (Exception e) {
            System.out.println("user not found");
        }
        System.out.println("type:" + list.subList(1, 4));
        return list;

    }

}
