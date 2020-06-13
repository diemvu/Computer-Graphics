import java.util.Arrays;

public class Matrix {
	static double[][] matrix;

	public Matrix() {
		matrix = new double[4][4];
		loadItentityMatrix();
	}

	static void setMatrix() {
		matrix = new double[][] { { 1, 1, 0, 0 }, { 1, 1, 0, 0 }, { 0, 0, 1, 3 }, { 1, 0, 0, 1 } };
	}

//	public static void main(String[] args) {
//		Matrix m = new Matrix();
//		m.loadItentityMatrix();
//		
//		System.out.println(m);
//		m.rotateY(45);
//		System.out.println(m);
//		Point p = m.multiplyPoint(new Point(1,0,0,1));
//		System.out.println(p);
//		
//	}

	public static void loadItentityMatrix() {
		for (int i = 0; i < 4; i++)
			for (int j = 0; j < 4; j++)
				matrix[i][j] = 0;

		for (int i = 0; i < 4; i++)
			matrix[i][i] = 1;

	}

	public static Point multiplyPoint(Point p) {
		double[] point = new double[] { p.getX(), p.getY(), p.getZ(), p.getW() };
		double[] result = new double[4];
		for (int i = 0; i < 4; i++) {
			double sum = 0;
			for (int j = 0; j < 4; j++) {
				sum += matrix[i][j] * point[j];
			}
			result[i] = sum;
		}
		return new Point(result[0], result[1], result[2], result[3]);
	}

	public static void multiplyMatrix(double[][] transform) {
		double[][] result = new double[4][4];
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 4; j++) {
				double sum = 0;
				for (int k = 0; k < 4; k++) {
					double x = transform[i][k];
					double y = matrix[k][j];

					sum = sum + x * y;
				}
				result[i][j] = sum;
			}
		}
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 4; j++) {
				matrix[i][j] = result[i][j];
			}
		}
	}

	public static void scale(double sx, double sy, double sz) {
		double[][] S = new double[][] { { sx, 0, 0, 0 }, { 0, sy, 0, 0 }, { 0, 0, sz, 0 }, { 0, 0, 0, 1 } };
		multiplyMatrix(S);
	}

	public static void translate(double dx, double dy, double dz) {
		double[][] T = new double[][] { { 1, 0, 0, dx }, { 0, 1, 0, dy }, { 0, 0, 1, dz }, { 0, 0, 0, 1 } };
		multiplyMatrix(T);

	}

	public static void rotateX(double degree) {
		double radian = Math.toRadians(degree);

		double cos = Math.cos(radian);
		double sin = Math.sin(radian);
		double[][] RotateX = new double[][] { { 1, 0, 0, 0 }, { 0, cos, 0 - sin, 0 }, { 0, sin, cos, 0 },
				{ 0, 0, 0, 1 } };
		multiplyMatrix(RotateX);

	}

	public static void rotateY(double degree) {
		double radian = Math.toRadians(degree);
		double cos = Math.cos(radian);
		double sin = Math.sin(radian);
		double[][] RotateY = new double[][] { { cos, 0, sin, 0 }, { 0, 1, 0, 0 }, { 0 - sin, 0, cos, 0 },
				{ 0, 0, 0, 1 } };
		multiplyMatrix(RotateY);
	}

	public static void rotateZ(double degree) {
		double radian = Math.toRadians(degree);
		double cos = Math.cos(radian);
		double sin = Math.sin(radian);
		double[][] RotateZ = new double[][] { { cos, 0 - sin, 0, 0 }, { sin, cos, 0, 0 }, { 0, 0, 1, 0 },
				{ 0, 0, 0, 1 } };
		multiplyMatrix(RotateZ);
	}

	public String toString() {
		String s = "";
		for (int i = 0; i < matrix.length; i++) {
			for (int j = 0; j < matrix[0].length; j++) {
				s += matrix[i][j] + " ";
			}
			s += "\n";
		}
		return s;
	}

}
