import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.image.*;
import javax.swing.*;

import java.io.*;
import java.util.*;

/**
 * 
 * @author Diem Vu
 * @author John Mayer
 *
 */
public class Drawer extends JPanel implements KeyListener {
	static int width;
	static int height;
	int imageSize;
	int[] pixels;
	double[] zBuffer;
	double red;
	double green;
	double blue;
	Matrix CTM;
	double rotateX;
	double rotateY;

	void drawPixel(int x, int y, int r, int g, int b) {
		pixels[(height - y - 1) * width * 3 + x * 3] = r;
		pixels[(height - y - 1) * width * 3 + x * 3 + 1] = g;
		pixels[(height - y - 1) * width * 3 + x * 3 + 2] = b;
	}

	void createImage() {
		Scanner input = getFile();
		double thetaX = 0.0;
		double thetaY = 0.0;
		boolean modifyX = false;
		boolean modifyY = false;
		while (input.hasNext()) {
			String command = input.next();
			if (command.equals("DIM")) {
				width = input.nextInt();
				height = input.nextInt();
				imageSize = width * height;
				pixels = new int[imageSize * 3];
				zBuffer = new double[imageSize];
				for (int i = 0; i < zBuffer.length; i++) {
					zBuffer[i] = -3;
				}

				for (int i = 0; i < width; i++) {
					for (int j = 0; j < height; j++) {
						drawPixel(i, j, 255, 255, 255);
					}
				}
			} else if (command.equals("LINE")) {
				if (thetaX == 0 && rotateX != 0 && !modifyX) {
					CTM.rotateX(rotateX);
					modifyX = true;

				}
				if (thetaY == 0 && rotateY != 0 && !modifyY) {
					CTM.rotateX(rotateY);
					modifyY = true;

				}
				// get value of x,y coordinate of start and end point of line
				double startX = input.nextDouble();
				double startY = input.nextDouble();
				double startZ = input.nextDouble();
				Point p1 = new Point(startX, startY, startZ, 1);
				Point newp1 = CTM.multiplyPoint(p1);

				double endX = input.nextDouble();
				double endY = input.nextDouble();
				double endZ = input.nextDouble();
				Point p2 = new Point(endX, endY, endZ, 1);
				Point newp2 = CTM.multiplyPoint(p2);
				DDA(newp1, newp2);

			} else if (command.equals("RGB")) {
				String s = "";
				// get value of red, green and blue color
				red = input.nextDouble();
				green = input.nextDouble();
				blue = input.nextDouble();
			} else if (command.equals("TRI")) {
				if (thetaX == 0 && rotateX != 0 && !modifyX) {
					CTM.rotateX(rotateX);
					modifyX = true;

				}
				if (thetaY == 0 && rotateY != 0 && !modifyY ) {
					CTM.rotateY(rotateY);
					modifyY = true;

				}
				// get x,y coordinate of 3 vertexes of a triangle
				Point p1 = new Point();
				p1.x = input.nextDouble();
				p1.y = input.nextDouble();
				p1.z = input.nextDouble();

				Point p2 = new Point();
				p2.x = input.nextDouble();
				p2.y = input.nextDouble();
				p2.z = input.nextDouble();

				Point p3 = new Point();
				p3.x = input.nextDouble();
				p3.y = input.nextDouble();
				p3.z = input.nextDouble();

				p1 = CTM.multiplyPoint(p1);
				p2 = CTM.multiplyPoint(p2);
				p3 = CTM.multiplyPoint(p3);

				scanlineTri(p1, p2, p3);

			} else if (command.contentEquals("LOAD_IDENTITY_MATRIX")) {
				CTM.loadItentityMatrix();
				thetaX = 0;
				thetaY = 0;
				modifyX = false;
				modifyY = false;

			} else if (command.equals("SCALE")) {
				double sx = input.nextDouble();
				double sy = input.nextDouble();
				double sz = input.nextDouble();
				CTM.scale(sx, sy, sz);
			} else if (command.equals("TRANSLATE")) {
				double dx = input.nextDouble();
				double dy = input.nextDouble();
				double dz = input.nextDouble();
				CTM.translate(dx, dy, dz);
			} else if (command.equals("ROTATEX")) {
				thetaX = input.nextDouble();
				double degree = rotateX + thetaX;
				CTM.rotateX(degree);
			} else if (command.equals("ROTATEY")) {
				thetaY = input.nextDouble();
				double degree = rotateY + thetaY;
				CTM.rotateY(rotateY);
			} else if (command.equals("ROTATEZ")) {
				double degree = input.nextDouble();
				CTM.rotateZ(degree);
			} else if (command.equals("SOLID_CUBE")) {
				if (thetaX == 0 && rotateX != 0 && !modifyX) {
					CTM.rotateX(rotateX);
					modifyX = true;

				}
				if (thetaY == 0 && rotateY != 0 && !modifyY) {
					CTM.rotateY(rotateY);
					modifyY = true;

				}
				solidCube(CTM);
			} else if (command.equals("WIREFRAME_CUBE")) {
				if (thetaX == 0 && rotateX != 0 && !modifyX) {
					CTM.rotateX(rotateX);
					modifyX = true;

				}
				if (thetaY == 0 && rotateY != 0 && !modifyY) {
					CTM.rotateY(rotateY);
					modifyY = true;

				}
				wireframeCube(CTM);
			}

		}

	}

	public void solidCube(Matrix CTM) {
		Cube cube = new Cube();
		String s = "";
		Point point1 = CTM.multiplyPoint(cube.p1);
		Point point2 = CTM.multiplyPoint(cube.p2);
		Point point3 = CTM.multiplyPoint(cube.p3);
		Point point4 = CTM.multiplyPoint(cube.p4);
		Point point5 = CTM.multiplyPoint(cube.p5);
		Point point6 = CTM.multiplyPoint(cube.p6);
		Point point7 = CTM.multiplyPoint(cube.p7);
		Point point8 = CTM.multiplyPoint(cube.p8);
		scanlineTri(point1, point2, point3);
		//
		scanlineTri(point2, point3, point4);
		//
		scanlineTri(point5, point7, point8);
		//
		scanlineTri(point5, point6, point8);
		//
		scanlineTri(point5, point1, point2);
		//
		scanlineTri(point5, point6, point2);
		//
		scanlineTri(point3, point7, point8);
		//
		scanlineTri(point3, point8, point4);
		//
		scanlineTri(point1, point5, point7);
		//
		scanlineTri(point1, point7, point3);
		//
		scanlineTri(point6, point8, point4);
		//
		scanlineTri(point6, point2, point4);

	}

	public void wireframeCube(Matrix CTM) {
		Cube cube = new Cube();
		String s = "";
		Point point1 = CTM.multiplyPoint(cube.p1);
		Point point2 = CTM.multiplyPoint(cube.p2);
		Point point3 = CTM.multiplyPoint(cube.p3);
		Point point4 = CTM.multiplyPoint(cube.p4);
		Point point5 = CTM.multiplyPoint(cube.p5);
		Point point6 = CTM.multiplyPoint(cube.p6);
		Point point7 = CTM.multiplyPoint(cube.p7);
		Point point8 = CTM.multiplyPoint(cube.p8);
		s = "";
		DDA(point1, point2);

		DDA(point1, point3);

		DDA(point3, point4);

		DDA(point4, point2);

		DDA(point1, point5);

		DDA(point5, point6);
		DDA(point6, point2);

		DDA(point3, point7);
		DDA(point7, point5);
		DDA(point7, point8);
		DDA(point8, point4);
		DDA(point6, point8);

	}

	/**
	 * implement DDA algorithm to draw a line segment between 2 points
	 * 
	 * @param x1 x coordinate of first point
	 * @param y1 y coordinate of first point
	 * @param x2 x coordinate of second point
	 * @param y2 y coordinate of second point
	 */
	public void DDA(Point p1, Point p2) {
		double dx = p2.x - p1.x; // change in x
		double dy = p2.y - p1.y; // change in y
		int steps = 0; // how many times y and x will be incremented
		// if change in x is greater than change in y, the number of times
		// incrementing y and x depends on dx
		if (Math.abs(dx) > Math.abs(dy)) {
			steps = (int) (Math.abs(dx) / 2 * (double) width) * 4;
		}
		// if change in y is greater than change in x, the number of times
		// incrementing y and x depends on dy
		else {
			steps = (int) (Math.abs(dy) / 2 * (double) height) * 4;
		}
		// start position from first point
		double X = p1.x;
		double Y = p1.y;
		// how much X will be incremented/decremented
		double Xinc = dx / (double) steps;
		// How much Y will be incremented/decremented
		double Yinc = dy / (double) steps;

		for (int i = 0; i < steps; i++) {
			double newZ = calculateZ(p1, p2, X, Y);
			double m = (double) width - 1.0;
			double n = (double) height - 1.0;

			// x,y screen coordinate
			int x_screen = (int) (m * (X + 1.0) / 2.0);
			int y_screen = (int) (n * (Y + 1.0) / 2.0);
			int pix = (height - y_screen - 1) * width + x_screen;
			double oldZ = zBuffer[pix];

			if (newZ >= oldZ) {
				zBuffer[pix] = newZ;

				// value of red,green and blue pixel
				int r = (int) (red * 255);
				int g = (int) (green * 255);
				int b = (int) (blue * 255);
				drawPixel(x_screen, y_screen, r, g, b);

			}

			X += Xinc;
			Y += Yinc;
		}

	}

	double calculateZ(Point p1, Point p2, double x, double y) {
		double dx = p1.x - p2.x;
		double dy = p1.y - p2.y;
		double dz = p1.z - p2.z;
		double z = 0;
		if (dx != 0) {
			z = ((x - p1.x) * dz / dx) + p1.z;
		} else if (dy != 0) {
			z = ((y - p1.y) * dz / dy) + p1.z;
		}
		return z;

	}

	/**
	 * 
	 * @param p1 first vertex of a triangle
	 * @param p2 second vertex of a triangle
	 * @param p3 third vertex of a triangle
	 */
	public void scanlineTri(Point p1, Point p2, Point p3) {
		if (!sameLine(p1, p2, p3)) {
			// lowest scan line starts from minY
			double minY = Math.min(p1.y, Math.min(p2.y, p3.y));
			// highest scan line stops at maxY
			double maxY = Math.max(p1.y, Math.max(p2.y, p3.y));
			double currentY = minY;
			// how many times y is incremented
			double steps = ((maxY - minY) * 100 * (double) height);
			// how much y is incremented each time
			double Yinc = Math.abs((maxY - minY) / steps);
			while (currentY <= maxY) {
				// intersection of current scan line and edges
				Point I1 = intersection(currentY, p1, p2);
				Point I2 = intersection(currentY, p2, p3);
				Point I3 = intersection(currentY, p1, p3);
				// draw line between 2 intersections
				if (I1 == null) {

					DDA(I2, I3);
				} else if (I2 == null) {
					DDA(I1, I3);
				} else if (I3 == null) {
					DDA(I2, I1);
				} else {
					double minX = Math.min(I1.x, Math.min(I2.x, I3.x));
					double maxX = Math.max(I1.x, Math.max(I2.x, I3.x));
					double z1 = 0;
					double z2 = 0;
					if (minX == I1.x) {
						z1 = I1.z;
					} else if (minX == I2.x) {
						z1 = I2.z;
					} else if (minX == I3.x) {
						z1 = I3.z;
					}

					if (maxX == I1.x) {
						z2 = I1.z;
					} else if (maxX == I2.x) {
						z2 = I2.z;
					} else if (maxX == I3.x) {
						z2 = I3.z;
					}
					DDA(new Point(minX, currentY, z1, 1), new Point(maxX, currentY, z2, 1));
					// DDA(minX, currentY, maxX, currentY);
				}
				// increment y value of scan line
				currentY += Yinc;
			}
		}

	}

	/**
	 * 
	 * @param y:  y value of scane line
	 * @param p1: first point of an edge
	 * @param p2: second point of an edge
	 * @return intersection of scane line and edges
	 */
	public Point intersection(double y, Point p1, Point p2) {
		// changes in y and x
		double dy = p2.y - p1.y;
		double dx = p2.x - p1.x;
		// if the edge is vertical
		if (dx == 0) {
			// if scan line cross the edge
			if (y <= Math.max(p1.y, p2.y) && y >= Math.min(p1.y, p2.y)) {

				double z = calculateZ(p1, p2, p1.x, y);
				return new Point(p1.x, y, z, 1);

			}

		}
		// if the edge is not vertical
		else {
			// calculate slope of edge
			double slope = dy / dx;
			// if the edge is not horizontal, calculate the intersection between
			// scanline and edges
			if (slope != 0) {
				if (y <= Math.max(p1.y, p2.y) && y >= Math.min(p1.y, p2.y)) {
					double intercept = p1.y - slope * p1.x;
					double X = (y - intercept) / slope;
					double z = calculateZ(p1, p2, X, y);

					return new Point(X, y, z, 1);
				}

			}

		}
		return null;

	}

	public boolean sameLine(Point p1, Point p2, Point p3) {
		double dx1 = p1.x - p2.x;
		double dy1 = p1.y - p2.y;
		double dx2 = p1.x - p3.x;
		double dy2 = p1.y - p3.y;
		double dx3 = p2.x - p3.x;
		double dy3 = p2.y - p3.y;

		if (dx1 == 0 && dy1 == 0 && dx2 == 0 && dy2 == 0 && dx3 == 0 && dy3 == 0) {
			drawPoint(p1.x, p1.y);
			return true;
		} else if (dx1 == 0 && dy1 == 0) {
			DDA(p1, p3);
			return true;
		} else if (dx2 == 0 && dy2 == 0) {
			DDA(p1, p2);
			return true;
		} else if (dx3 == 0 && dy3 == 0) {
			DDA(p1, p2);
			return true;
		} else {
			if (dx1 == 0) {
				if (p3.x == p1.x) {
					DDA(p1, p2);
					DDA(p1, p3);
					DDA(p3, p2);
					return true;
				}
			} else {

			}
			double m = dy1 / dx1;
			double c = p1.y - m * p1.x;
			double lineFormula = p3.y - m * p3.x - c;
			if (lineFormula == 0) {
				DDA(p1, p2);
				DDA(p1, p3);
				DDA(p3, p2);
				return true;

			}
		}
		return false;

	}

	public void drawPoint(double X, double Y) {
		double m = (double) width - 1.0;
		double n = (double) height - 1.0;
		int x_screen = (int) (m * (X + 1.0) / 2.0);
		int y_screen = (int) (n * (Y + 1.0) / 2.0);
		// value of red,green and blue pixel
		int r = (int) (red * 255);
		int g = (int) (green * 255);
		int b = (int) (blue * 255);
		drawPixel(x_screen, y_screen, r, g, b);
	}

	public void paintComponent(Graphics g) {
		CTM = new Matrix();
		createImage();
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		WritableRaster wr_raster = image.getRaster();
		wr_raster.setPixels(0, 0, width, height, pixels);
		g.drawImage(image, 0, 0, null);

	}

	public static void main(String args[]) {

		JFrame frame = new JFrame("LINE DEMO");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		selectFile();

		JPanel rootPane = new Drawer();
		getDim(rootPane);
		rootPane.setPreferredSize(new Dimension(width, height));
		frame.addKeyListener((KeyListener) rootPane);
		frame.getContentPane().add(rootPane);
		frame.pack();
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);

	}

	static File selectedFile = null;

	static private void selectFile() {
		int approve; // return value from JFileChooser indicates if the user hit
						// cancel

		JFileChooser chooser = new JFileChooser();
		chooser.setCurrentDirectory(new File("."));

		approve = chooser.showOpenDialog(null);
		if (approve != JFileChooser.APPROVE_OPTION) {
			System.exit(0);
		} else {
			selectedFile = chooser.getSelectedFile();
		}
	}

	static private Scanner getFile() {
		Scanner input = null;
		try {
			input = new Scanner(selectedFile);
		} catch (Exception e) {
			JOptionPane.showMessageDialog(null, "There was an error with the file you chose.", "File Error",
					JOptionPane.ERROR_MESSAGE);
		}
		return input;
	}

	static void getDim(JPanel rootPane) {
		Scanner input = getFile();

		String command = input.next();
		if (command.equals("DIM")) {
			width = input.nextInt();
			height = input.nextInt();
			rootPane.setPreferredSize(new Dimension(width, height));
		}
	}

	@Override
	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void keyPressed(KeyEvent e) {
		if (e.getKeyCode() == KeyEvent.VK_UP) {
			rotateX = rotateX - 3;
			repaint();

		} else if (e.getKeyCode() == KeyEvent.VK_DOWN) {
			rotateX = rotateX + 3;
			repaint();

		} else if (e.getKeyCode() == KeyEvent.VK_RIGHT) {
			rotateY = rotateY - 3;
			repaint();

		} else if (e.getKeyCode() == KeyEvent.VK_LEFT) {
			rotateY = rotateY + 3;
			repaint();

		}

	}

	@Override
	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub

	}

}

class Cube {
	Point p1, p2, p3, p4, p5, p6, p7, p8;

	Cube() {
		p1 = new Point(0.5, 0.5, 0.5, 1);
		p2 = new Point(0.5, -.5, 0.5, 1);
		p3 = new Point(-0.5, 0.5, 0.5, 1);
		p4 = new Point(-0.5, -0.5, 0.5, 1);

		p5 = new Point(0.5, 0.5, -0.5, 1);
		p6 = new Point(0.5, -0.5, -0.5, 1);
		p7 = new Point(-0.5, 0.5, -0.5, 1);
		p8 = new Point(-0.5, -0.5, -0.5, 1);
	}
}
