# vidu

 <!-- THêm chuyến đi-->

    <section class="container" id="dichvu">
      <div class="admin-card" id="services">
        <div class="card-header">
          <h2><i class="fas fa-bus"></i> Thêm Chuyến Xe Mới</h2>
          <p>Nhập thông tin chi tiết để đăng chuyến đi</p>
        </div>

        <div class="card-body">
          <form id="addPhuongTienForm">
            <div class="form-row">
              <div class="form-group">
                <label>Điểm đi</label>
                <div class="input-wrapper">
                  <i class="fas fa-map-marker-alt"></i>
                  <input type="text" id="diemDon" required />
                </div>
              </div>

              <div class="form-group">
                <label>Điểm đến</label>
                <div class="input-wrapper">
                  <i class="fas fa-location-arrow"></i>
                  <input type="text" id="diemDen" required />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Số ghế trống</label>
                <div class="input-wrapper">
                  <i class="fas fa-chair"></i>
                  <input type="number" id="soGhe" required />
                </div>
              </div>

              <div class="form-group">
                <label>Giá vé (VNĐ)</label>
                <div class="input-wrapper">
                  <i class="fas fa-tag"></i>
                  <input type="number" id="giaVePhuongTien" required />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Ảnh xe (Tùy chọn)</label>
              <div class="file-upload-wrapper">
                <input type="file" id="anhPhuongTien" accept="image/*" />
                <div class="upload-icon">
                  <i class="fas fa-cloud-upload-alt"></i> Chọn ảnh
                </div>
              </div>
              <div id="previewPhuongTien" class="preview"></div>
            </div>

            <button type="submit" class="add-btn">Đăng chuyến xe ngay</button>
          </form>
        </div>
      </div>
    </section>

    <!-- ================= Danh sách chuyến đi ================= -->
    <section class="container" id="danhsachve">
      <h2>Danh sách chuyến đi đã thêm</h2>
      <div class="trips-list" id="tripsList"></div>
    </section>

    <!-- ================= Vé đã đặt ================= -->
    <section class="container" id="tickets">
      <h2>Vé đã đặt</h2>
      <div class="ticket-list" id="ticketsList"></div>
    </section>

    <!-- ================= Doanh thu ================= -->
    <section class="container" id="revenue">
      <h2>Doanh thu</h2>
      <p id="totalRevenue"></p>
    </section>
