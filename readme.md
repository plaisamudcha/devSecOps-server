## � Database Schema (ER Diagram)

```mermaid
erDiagram
    User {
        string id PK "UUID"
        string name
        string email UK "Unique"
        string password
        datetime createdAt
    }

    MovieList {
        string id PK "UUID"
        string userId FK
        int movieId "TMDB Movie ID"
        enum status "LIKED/DISLIKED/WATCH_LATER"
        string note "Optional"
        datetime createdAt
    }

    RefreshToken {
        string id PK "UUID"
        string userId FK
        string token UK "Unique"
        datetime createdAt
        datetime expiresAt
    }

    MovieStatus {
        LIKED
        DISLIKED
        WATCH_LATER
    }

    User ||--o{ MovieList : "has many"
    User ||--o{ RefreshToken : "has many"
    MovieList }o--|| MovieStatus : "uses"
```

### 📋 Database Tables Description

**👤 User Table**

- เก็บข้อมูลผู้ใช้งานระบบ
- Primary Key: `id` (UUID)
- Unique Fields: `email`

**🎬 MovieList Table**

- เก็บรายการภาพยนตร์ของผู้ใช้แต่ละคน
- เชื่อมโยงกับ TMDB API ผ่าน `movieId`
- รองรับสถานะ: ชอบ, ไม่ชอบ, ดูทีหลัง

**🔑 RefreshToken Table**

- เก็บ refresh tokens สำหรับ JWT authentication
- มี expiration date เพื่อความปลอดภัย

---

## �🔐 Authentication APIs

| Method | Endpoint         | Description           | Auth |
| ------ | ---------------- | --------------------- | ---- |
| POST   | `/auth/register` | Register a new user   | ❌   |
| POST   | `/auth/login`    | Login                 | ❌   |
| GET    | `/auth/me`       | Get current user info | ✅   |
| POST   | `/auth/logout`   | Logout                | ✅   |

---

## 🎬 Movie List APIs

| Method | Endpoint              | Description                                    | Auth |
| ------ | --------------------- | ---------------------------------------------- | ---- |
| GET    | `/movies/my-list`     | Get all movies in user's list                  | ✅   |
| GET    | `/movies/my-list/:id` | Get detail of a movie from user list           | ✅   |
| POST   | `/movies/add-to-list` | Add a movie to list (like/dislike/watch later) | ✅   |
| PUT    | `/movies/update/:id`  | Update status or note of a movie in list       | ✅   |
| DELETE | `/movies/remove/:id`  | Remove movie from list                         | ✅   |

## 🎬 TMDB APIs (The Movie Database)

| Method | Endpoint               | Description                                | Auth |
| ------ | ---------------------- | ------------------------------------------ | ---- |
| GET    | `/tmdb/get-all-movies` | Get all movies from TMDB (with pagination) | ❌   |
| GET    | `/tmdb/search`         | Search movies by query                     | ❌   |
| GET    | `/tmdb/popular`        | Get popular movies from TMDB               | ❌   |
| GET    | `/tmdb/top-rated`      | Get top-rated movies from TMDB             | ❌   |
| GET    | `/tmdb/upcoming`       | Get upcoming movies from TMDB              | ❌   |
| GET    | `/tmdb/movie/:id`      | Get movie details by TMDB ID               | ❌   |

### 📖 TMDB APIs รายละเอียด

**🎯 `/tmdb/get-all-movies`**

- ดึงข้อมูลภาพยนตร์ทั้งหมดจาก TMDB Database
- รองรับ pagination ผ่าน query parameter `page`
- ส่งคืนรายการภาพยนตร์พร้อมข้อมูลพื้นฐาน

**🔍 `/tmdb/search`**

- ค้นหาภาพยนตร์ตามคำค้นหา
- ต้องระบุ query parameter `query` (บังคับ)
- รองรับการค้นหาด้วยชื่อภาพยนตร์ภาษาอังกฤษ

**🔥 `/tmdb/popular`**

- ดึงรายการภาพยนตร์ยอดนิยมจาก TMDB
- รองรับ pagination ผ่าน query parameter `page`
- ข้อมูลอัปเดตแบบเรียลไทม์จาก TMDB

**⭐ `/tmdb/top-rated`**

- ดึงรายการภาพยนตร์ที่ได้คะแนนสูงสุด
- รองรับ pagination ผ่าน query parameter `page`
- เรียงลำดับตามคะแนนจากผู้ใช้ TMDB

**📅 `/tmdb/upcoming`**

- ดึงรายการภาพยนตร์ที่กำลังจะเข้าฉาย
- รองรับ pagination ผ่าน query parameter `page`
- ข้อมูลวันที่เข้าฉายและรายละเอียดล่วงหน้า

**🎬 `/tmdb/movie/:id`**

- ดึงรายละเอียดครบถ้วนของภาพยนตร์ตาม TMDB ID
- ข้อมูลสมบูรณ์รวมถึงเรื่องย่อ, นักแสดง, ผู้กำกับ
- ไม่ต้องการ pagination เนื่องจากเป็นข้อมูลเฉพาะเรื่อง
