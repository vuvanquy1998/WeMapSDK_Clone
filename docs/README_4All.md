## Run Example code
- In folder `example`
- Copy file `js` and `css` to folder `example/assets`
```bash
npm i
node route.js
```
- Directions test: Open browser address: http://localhost
- Pelias tes: Open browser address: http://localhost/pelias 


## Quy tắc code

- Code trong folder `src/wemap/src`
- Các hàm viết theo hàm mẫu có sẵn `src/wemap/src/form.js` sau đó sẽ import vào trong file `index.js`
	- Đặt tên hàm và tên biến: `variableName`
	- Sử dụng `let` khi khai báo không dùng `var`
	- Khi viết một hàm thì có comment ở trước có format như bên dưới có description, input, output:
	````javascript
		/**
		 * Returns getWeMapForm.
		 * @returns {String} '@WeMap Form'
		 */
		function getWeMapForm() {
			return '@WeMap Form';
		}
	```
- Style sẽ được viết trong folder `src/wemap/src/sass`
	- Tạo các file mới có tên `_file_name.scss` sau đó sẽ được import vào file `style.scss`
	- Chỉnh sửa trên nội dung các file đã tạo
	- Để compile css khi viết trên terminal `gulp watch` khi đó style sẽ được compile sang folder `src/wemap/src/css`

