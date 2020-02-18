## Thay đổi code trong direction.js
- Code gốc của function _onSingleClick đã được comment lại
- Code mới được hay thế bên dưới
- Sự thay đổi: Thêm + const { destination } = store.getState();
                    + điều kiện if (!destination.geometry) ở cuối cùng