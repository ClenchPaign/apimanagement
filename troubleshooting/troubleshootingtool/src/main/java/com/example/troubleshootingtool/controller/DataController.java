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
    @RequestMapping(value="/auth",method = RequestMethod.POST)
    public Boolean authenticate(@RequestBody User user) throws NullPointerException {
        LdapContext ctx = null;
        boolean result = false;
        System.out.println("ctx   :"+ctx);

        String username =  user.getUsername();
        String passwd=user.getPassword();
        try {

            ctx = context(username, passwd);
            System.out.println("ctx   :"+ctx);
            SearchControls searchCtls = new SearchControls();
            String returnedAtts[] = { "sn", "mail", "cn", "givenName","telephoneNumber" };
            searchCtls.setReturningAttributes(returnedAtts);
            searchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            String searchFilter = "(&(objectClass=user)(mail=*))";
            String searchBase = "OU=India,DC=eur,DC=ad,DC=sag";
            NamingEnumeration<?> answer = ctx.search(searchBase, searchFilter, searchCtls);
            System.out.println("answer   :"+answer);

            while (answer.hasMoreElements()) {
                SearchResult sr = (SearchResult) answer.next();
                System.out.println("sr  :"+sr);
                // Print some of the attributes, catch the exception if the
                // attributes have no values
                Attributes attrs = sr.getAttributes();
                if (attrs != null) {
                    String cn = attrs.get("cn").get().toString();

                    if (cn.endsWith(username.toLowerCase())
                            || cn.endsWith(username.toUpperCase())) {
                        result = true;
                        break;
                    } else
                        result = false;
                }
            }
        }
        catch (Exception e) {
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
        System.out.println("RESULT:"+result);

        return result;
    }

    public LdapContext context(String user, String passwd) throws NamingException {

        Hashtable<String, String> env = new Hashtable<String, String>();
        String adminName = "CN=" + user
                + ",OU=User,OU=India,DC=eur,DC=ad,DC=sag";
        System.out.println("name :"+adminName);
        String adminPassword = passwd;
        String ldapURL="ldap://hqdc.eur.ad.sag:3268";
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
        System.out.println("ctx   :"+ctx.getEnvironment().values());
        return ctx;
    }
}
