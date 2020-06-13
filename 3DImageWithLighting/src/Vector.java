/**
 * This class represents a 4D vector or homogenous point.
 * 
 *
 */
public class Vector {

	double x, y, z, w; // values for the vector

	/**
	 * Creates a new vector with the given values
	 * 
	 * @param x x value of vector
	 * @param y y value of vector
	 * @param z z value of vector
	 * @param w w value of vector
	 */
	public Vector(double x, double y, double z, double w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	/**
	 * No arg constructor that makes a vector with 0s for each value
	 */
	public Vector() {
		this(0, 0, 0, 0);
	}

	public static Vector normalize(Vector v) {
		double length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
		return new Vector(v.x / length, v.y / length, v.z / length, v.w / length);

	}

	public static double dotProduct(Vector v1, Vector v2) {
		double result = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
		return result;
	}

	public static Vector crossProduct(Vector v1, Vector v2) {
		return new Vector(v1.y * v2.z - v1.z * v2.y, -(v1.x * v2.z - v1.z * v2.x), v1.x * v2.y - v1.y * v2.x, 0);
	}

	public static Vector subtract(Vector v1, Vector v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
	}

	public static Vector add(Vector v1, Vector v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
	}

	public static Vector normalVector(Vector v1, Vector v2, Vector v3) {
		Vector first = subtract(v2, v1);
		Vector second = subtract(v3, v1);
		return crossProduct(first, second);
	}

	public static double getCosAngle(Vector v1, Vector v2) {
		double len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
		double len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
		double dot = dotProduct(v1, v2);
		return dot / (len1 * len2);

	}

	/**
	 * Computes the dot product of two vectors. The dot product is commutative.
	 *
	 * @param other the vector to be multiplied
	 * @return the value of the dot product
	 */
	public double dotProduct(Vector other) {
		return x * other.x + y * other.y + z * other.z + w * other.w;
	}

	public String toString() {
		return "[" + x + " " + y + " " + z + " " + w + "]";
	}
}
