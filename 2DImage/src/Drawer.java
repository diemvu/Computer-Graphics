import java.awt.*;
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
public class Drawer extends JPanel {
    static int width;
    static int height;
    int imageSize;
    int[] pixels;
    double red;
    double green;
    double blue;

    void drawPixel(int x, int y, int r, int g, int b) {
        pixels[(height - y - 1) * width * 3 + x * 3] = r;
        pixels[(height - y - 1) * width * 3 + x * 3 + 1] = g;
        pixels[(height - y - 1) * width * 3 + x * 3 + 2] = b;
    }

    void createImage() {

        Scanner input = getFile();
        while (input.hasNext()) {
            String command = input.next();
            if (command.equals("DIM")) {
                width = input.nextInt();
                height = input.nextInt();
                imageSize = width * height;
                pixels = new int[imageSize * 3];
                for (int i = 0; i < width; i++) {
                    for (int j = 0; j < height; j++) {
                        drawPixel(i, j, 255, 255, 255);
                    }
                }
            }
            else if (command.equals("LINE")) {
                // get value of x,y coordinate of start and end point of line
                double startX = input.nextDouble();
                double startY = input.nextDouble();
                double endX = input.nextDouble();
                double endY = input.nextDouble();
                DDA(startX, startY, endX, endY);

            }
            else if (command.equals("RGB")) {
                // get value of red, green and blue color
                red = input.nextDouble();
                green = input.nextDouble();
                blue = input.nextDouble();
            }
            else if (command.equals("TRI")) {
                // get x,y coordinate of 3 vertexes of a triangle
                double X1 = input.nextDouble();
                double Y1 = input.nextDouble();
                double X2 = input.nextDouble();
                double Y2 = input.nextDouble();
                double X3 = input.nextDouble();
                double Y3 = input.nextDouble();
                scanlineTri(new Point(X1, Y1), new Point(X2, Y2), new Point(X3, Y3));

            }
        }

    }

    /**
     * implement DDA algorithm to draw a line segment between 2 points
     * 
     * @param x1 x coordinate of first point
     * @param y1 y coordinate of first point
     * @param x2 x coordinate of second point
     * @param y2 y coordinate of second point
     */
    public void DDA(double x1, double y1, double x2, double y2) {
        double dx = x2 - x1; // change in x
        double dy = y2 - y1; // change in y
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
        double X = x1;
        double Y = y1;
        // how much X will be incremented/decremented
        double Xinc = Math.abs(dx / (double) steps);
        // How much Y will be incremented/decremented
        double Yinc = Math.abs(dy / (double) steps);

        for (int i = 0; i < steps; i++) {
            double m = (double) width - 1.0;
            double n = (double) height - 1.0;
            // x,y screen coordinate
            int x_screen = (int) (m * (X + 1.0) / 2.0);
            int y_screen = (int) (n * (Y + 1.0) / 2.0);
            // value of red,green and blue pixel
            int r = (int) (red * 255);
            int g = (int) (green * 255);
            int b = (int) (blue * 255);
            drawPixel(x_screen, y_screen, r, g, b);

            // if x increases from point 1 to point 2, x is incremented
            // if y increases from point 1 to point 2, y is incremented
            if (dx >= 0 && dy >= 0) {
                X += Xinc;
                Y += Yinc;
            }
            // if x decreases from point 1 to point 2, x is decremented
            // if y increases from point 1 to point 2, y is incremented
            else if (dx < 0 && dy >= 0) {
                X -= Xinc;
                Y += Yinc;

            }
            // if x increases from point 1 to point 2, x is incremented
            // if y decreases from point 1 to point 2, y is decremented
            else if (dx >= 0 && dy < 0) {
                X += Xinc;
                Y -= Yinc;
            }
            // if x decreases from point 1 to point 2, x is decremented
            // if y decreases from point 1 to point 2, y is decremented
            else if (dx < 0 && dy < 0) {
                X -= Xinc;
                Y -= Yinc;
            }
        }
    }

    /**
     * 
     * @param p1 first vertex of a triangle
     * @param p2 second vertex of a triangle
     * @param p3 third vertex of a triangle
     */
    public void scanlineTri(Point p1, Point p2, Point p3) {
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

                DDA(I2.x, currentY, I3.x, currentY);
            }
            else if (I2 == null) {
                DDA(I1.x, currentY, I3.x, currentY);
            }
            else if (I3 == null) {
                DDA(I2.x, currentY, I1.x, currentY);
            }
            else {
                double minX = Math.min(I1.x, Math.min(I2.x, I3.x));
                double maxX = Math.max(I1.x, Math.max(I2.x, I3.x));
                DDA(minX, currentY, maxX, currentY);
            }
            // increment y value of scan line
            currentY += Yinc;
        }

    }

    /**
     * 
     * @param y: y value of scane line
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
            if (y <= Math.max(p1.y, p2.y) && y >= Math.min(p1.y, p2.y))
                return new Point(p1.x, y);
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

                    return new Point(X, y);
                }

            }

        }
        return null;

    }

    public void paintComponent(Graphics g) {
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
        }
        else {
            selectedFile = chooser.getSelectedFile();
        }
    }

    static private Scanner getFile() {
        Scanner input = null;
        try {
            input = new Scanner(selectedFile);
        }
        catch (Exception e) {
            JOptionPane.showMessageDialog(null, "There was an error with the file you chose.",
                                          "File Error", JOptionPane.ERROR_MESSAGE);
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

}

class Point {
    double x;
    double y;

    Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    boolean equals(Point p2) {
        if (this.x == p2.x && this.y == p2.y)
            return true;
        else
            return false;
    }
}
