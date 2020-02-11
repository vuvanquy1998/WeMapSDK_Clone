## Class, hàm, biến

- Viết Class và hàm
- Tên class được viết theo format sau: TenCuaClass
- Tên của hàm hoặc tên của biết được viết theo format sau: tenCuaBien, tenCuaFunction
- Các thuộc tính của Class cần sử dụng sẽ được đặt trong constructor
- Để lấy giá trị của một hàm thông qua Getter
- Để thay đổi giá trị của thuộc tính thông qua hàm Setter

```javascript
/*
* Rectangle Class
* */
class Rectangle {
  constructor(height, width, name) {
    this.height = height;
    this.width = width;
    this.name = name;
  }
  // Getter
  get area() {
    return this.calcArea();
  }
  
  // Getter name
  get name() {
      return this.name.toUpperCase();
  }
    
  // Setter name
  set name(newName) {
      this.name = newName; 
  }
  
  // Method
  calcArea() {
    return this.height * this.width;
  }
}

const square = new Rectangle(10, 10, "Rectangle Name");

console.log(square.area); // 100
```

## Static method
- Static method: Cho phép access vào function mà không cần tạo 1 instance mới
- Static method sử dụng khi là những hàm tiện ích. Ví dụ: tính khoảng cách giữa 2 điểm
```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);
// Can't access static method like below
p1.distance; //undefined
p2.distance; //undefined

// Accessed static method  like below
console.log(Point.distance(p1, p2)); // 7.0710678118654755
```
