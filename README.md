# Auth

## 1.Register | POST | /auth/register
```
http://localhost:4000/auth/register
```
<img width="1263" height="900" alt="Screenshot 2025-10-22 010219" src="https://github.com/user-attachments/assets/40222e16-03df-464c-93d4-575eac382cd7" />
<img width="1250" height="912" alt="Screenshot 2025-10-22 010253" src="https://github.com/user-attachments/assets/ef75430f-85a2-4ed3-a31d-6cce1b0c285e" />
<img width="1385" height="233" alt="Screenshot 2025-10-22 010308" src="https://github.com/user-attachments/assets/b553468a-4d38-4c85-b6f8-cf95f99abfd7" />

## 2.Login | POST | /auth/login
```
http://localhost:4000/auth/login
```
<img width="1257" height="927" alt="Screenshot 2025-10-22 010700" src="https://github.com/user-attachments/assets/d443d0fe-81b7-4d16-975f-1908f1439f6d" />

## 3.Get Me | GET | /auth/me
```
http://localhost:4000/auth/me
```
- Dapat token setelah kita login, misal login sebagai `tir` jadi tokennya yaitu `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTM0ZDJiLWM3NDAtNDU2Ni05NWQ0LTI5YzJmNDk0Njc1OSIsImVtYWlsIjoidGlyQGdtYWlsLmNvbSIsImlhdCI6MTc2MTA3MDAwNSwiZXhwIjoxNzYxMDczNjA1fQ.mqhPdWCSfMiBafJh6N68AmV71Cg_avaEFOBDGyNOBCc`
<img width="1264" height="897" alt="Screenshot 2025-10-22 011105" src="https://github.com/user-attachments/assets/05920e75-56c6-4173-8705-d36359d3fe4c" />

# Library

## 1.Create Book | POST | /books
```
http://localhost:4000/books
```
<img width="1226" height="845" alt="Screenshot 2025-10-22 012421" src="https://github.com/user-attachments/assets/5246d9c5-69fb-499a-9dd9-cc510e5aa977" />
<img width="1359" height="140" alt="Screenshot 2025-10-22 012449" src="https://github.com/user-attachments/assets/a555193a-d272-4912-b1e3-4fe70a2b950e" />
<img width="1334" height="131" alt="Screenshot 2025-10-22 012500" src="https://github.com/user-attachments/assets/c9379b90-54a6-4335-8d78-3055b08c76a6" />


## 2.Get All Book | GET | /books
```
http://localhost:4000/books
```
Buku akan tampil semua
<img width="1471" height="1003" alt="Screenshot 2025-10-22 012831" src="https://github.com/user-attachments/assets/910c1919-1f27-4255-9960-4967a2d67b00" />

## 3.Get Book Detail | GET | /books/:book_id
```
http://localhost:4000/books/84f3cfec-17b0-40c3-9a70-c34667b155ab
```
Memanggil buku `Laut Bercerita` dengan ID buku `84f3cfec-17b0-40c3-9a70-c34667b155ab` dan dengan token `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTM0ZDJiLWM3NDAtNDU2Ni05NWQ0LTI5YzJmNDk0Njc1OSIsImVtYWlsIjoidGlyQGdtYWlsLmNvbSIsImlhdCI6MTc2MTA3MDAwNSwiZXhwIjoxNzYxMDczNjA1fQ.mqhPdWCSfMiBafJh6N68AmV71Cg_avaEFOBDGyNOBCc`
<img width="1274" height="856" alt="Screenshot 2025-10-22 013625" src="https://github.com/user-attachments/assets/668ee34d-be5f-4fe8-a68f-23950f2e9d2b" />

## 4.Get Book By Genre | GET | /books/genre/:genre_id
```
http://localhost:4000/books/genre/c34b1576-9613-4461-84e1-cbeea61df1db
```
Pengguna dapat melihat daftar buku dalam sebuah genre melalui endpoint ini. Yaitu dengan memasukkan id genre `c34b1576-9613-4461-84e1-cbeea61df1db` lalu akan keluar buku dengan ID genre tersebut

<img width="250" height="132" alt="Screenshot 2025-10-22 014926" src="https://github.com/user-attachments/assets/9b94b6e5-e4a0-4ca6-9ce4-5e62e9a160d3" />
<img width="1477" height="974" alt="Screenshot 2025-10-22 014428" src="https://github.com/user-attachments/assets/8efded88-f941-40dc-9ce0-dd534d1caca3" />

## 5.Update Book | PATCH | /books/:book_id
```
http://localhost:4000/books/6a124f9e-7d26-49ab-86e2-d64af4ed5b73
```
Mengedit data buku. Yaitu dengan memasukkan ID `6a124f9e-7d26-49ab-86e2-d64af4ed5b73` dengan nama buku `Cantik Itu Luka` lalu mengedit harga dari harga `6000` menjadi `200`
<img width="1463" height="781" alt="Screenshot 2025-10-22 015215" src="https://github.com/user-attachments/assets/00123b44-6f8e-4c22-8da5-c1bc60dd6aea" />
<img width="1144" height="99" alt="Screenshot 2025-10-22 015322" src="https://github.com/user-attachments/assets/b5597239-33c9-4d64-8c13-07bea82777d5" />
<img width="1451" height="754" alt="Screenshot 2025-10-22 015348" src="https://github.com/user-attachments/assets/aa670299-8846-431f-bebc-09131777ad67" />
<img width="1219" height="112" alt="Screenshot 2025-10-22 015414" src="https://github.com/user-attachments/assets/f680ea66-a269-454e-b5eb-151c4a850424" />


## 6. Delete Book | DELETE | /books/:book_id
```
http://localhost:4000/books/84f3cfec-17b0-40c3-9a70-c34667b155ab
```
Menghapus buku berjudul Cantik itu Luka
<img width="1462" height="675" alt="Screenshot 2025-10-22 021716" src="https://github.com/user-attachments/assets/9d29fa89-f64e-4aa8-89c4-58ecd3390584" />
<img width="1214" height="74" alt="Screenshot 2025-10-22 021736" src="https://github.com/user-attachments/assets/08365137-e99e-4586-9355-b84c35b426e4" />





