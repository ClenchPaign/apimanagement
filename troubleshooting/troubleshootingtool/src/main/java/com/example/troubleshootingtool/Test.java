package com.example.troubleshootingtool;

class Node{
    String data;
    Node previousNode;
    Node nextNode;
    Node childNode;
    Node(String data){
        this.data = data;
    }
}

public class Test {

    public static void main(String[] args) {
        Node head= new Node("head");
        Node node1= new Node("1");
        Node node2= new Node("2");
        Node node3= new Node("3");
        Node child1= new Node("childone");
        Node child2= new Node("childtwo");
        node1.previousNode = head;
        node2.previousNode = node1;
        node3.previousNode = node2;
        head.nextNode = node1;
        node1.nextNode = node2;
        node2.nextNode = node3;
        node2.childNode = child1;
        child1.nextNode = child2;
        printFun(head);
    }

    static void printFun(Node node){
        System.out.print(node.data+"-");
        if(node.childNode !=null){
            printFun(node.childNode);
        }
        if(node.nextNode != null){
            printFun(node.nextNode);
        }
    }

}