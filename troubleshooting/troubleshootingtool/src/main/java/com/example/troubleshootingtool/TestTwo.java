package com.example.troubleshootingtool;

import java.util.Scanner;

public class TestTwo {
    public static void main(String[] args) {

//        Scanner s = new Scanner(System.in);
//        System.out.println("Enter array size and elements");
//        int arraySize = s.nextInt();
//        int[] mainArray = new int[arraySize];
//        for (int i = 0; i < mainArray.length; i++) {
//            mainArray[i] = s.nextInt();
//        }
        int[] mainArray = new int[]{5, 3, 1, 8, 4, 9, 7};
        int in = mainArray[0];
        int out = 0;
        int temp ;
        for (int i = 1; i < mainArray.length; i++) {
            System.out.println("1.in-" + in);
            if (in > out) {
                temp = in;
            } else {
                temp = out;
            }
            System.out.println("in-" + in + " mainarray[" + i + "]-" + mainArray[i]+" out-"+out+" temp-"+temp);
            in = out + mainArray[i];
            out = temp;
            System.out.println("2.in-" + in);
//            System.out.println("out-" + out);
//            System.out.println("temp-" + temp);
        }

        if (in > out) {
            System.out.println(in);
        } else {
            System.out.println(out);
        }
    }
}
