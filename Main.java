import java.util.Scanner;

public class Main {
    static Scanner sc = new Scanner(System.in);

    // Bai 1: Nhap thong tin va hien
    public static void gioiThieu() {
        System.out.print("Nhap ho va ten: ");
        String hoTen = sc.nextLine();

        System.out.print("Nhap MSSV: ");
        String mssv = sc.nextLine();

        System.out.print("Nhap lop: ");
        String lop = sc.nextLine();

        System.out.print("Nhap truong: ");
        String truong = sc.nextLine();

        System.out.println("\n--- Thong tin ca nhan ---");
        System.out.println("Ho va ten: " + hoTen);
        System.out.println("MSSV: " + mssv);
        System.out.println("Lop: " + lop);
        System.out.println("Truong: " + truong);
    }

    // Bai 2a: max2
    public static int max2() {
        System.out.print("Nhap so thu 1: ");
        int so1 = sc.nextInt();
        System.out.print("Nhap so thu 2: ");
        int so2 = sc.nextInt();

        return (so1 > so2) ? so1 : so2;
    }

    // Bai 2b: max3
    public static int max3() {
        System.out.print("Nhap so thu 1: ");
        int so1 = sc.nextInt();
        System.out.print("Nhap so thu 2: ");
        int so2 = sc.nextInt();
        System.out.print("Nhap so thu 3: ");
        int so3 = sc.nextInt();

        int max = so1;
        if (so2 > max) max = so2;
        if (so3 > max) max = so3;
        return max;
    }

    // Bai 3: maxArray
    public static int maxArray(int[] myArray) {
        int max = myArray[0];
        for (int i = 1; i < myArray.length; i++) {
            if (myArray[i] > max) {
                max = myArray[i];
            }
        }
        return max;
    }

    // Bai 4: frequency
    public static int frequency() {
        System.out.print("Nhap chuoi ky tu: ");
        sc.nextLine(); // clear buffer
        String str = sc.nextLine();

        int[] freq = new int[256]; 
        int maxFreq = 0;

        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            freq[c]++;
            if (freq[c] > maxFreq) {
                maxFreq = freq[c];
            }
        }
        return maxFreq;
    }

    public static void main(String[] args) {
        // Bai 1
        gioiThieu();

        // Bai 2
        System.out.println("\nSo lon nhat trong 2 so la: " + max2());
        System.out.println("So lon nhat trong 3 so la: " + max3());

        // Bai 3
        System.out.print("\nNhap so phan tu cua mang: ");
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            System.out.print("arr[" + i + "] = ");
            arr[i] = sc.nextInt();
        }
        System.out.println("So lon nhat trong mang la: " + maxArray(arr));

        // Bai 4
        System.out.println("\nTan suat xuat hien lon nhat la: " + frequency());
    }
}
