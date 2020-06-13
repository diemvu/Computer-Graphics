
public class Point {
	double x;
	double y;
	double z;
	double w;
	Point(double x, double y, double z,double w){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	public Point() {
		this.w=1;
	}
	public double getX() {
		return x;
	}
	public double getY() {
		return y;
	}
	public double getZ() {
		return z;
	}
	public double getW() {
		return w;
	}
	public void setX(double x) {
		this.x = x;
	}
	public void setY(double y) {
		this.y = y;
	}
	public void setZ(double z) {
		this.z = z;
	}
	public void setW(double w) {
		this.w = w;
	}
	public String toString() {
		return "x: "+x+", y: "+y+", z: "+z+", w: "+w;
	}
	

}
