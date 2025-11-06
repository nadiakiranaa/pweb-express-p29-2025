import { Request, Response } from "express";
import { PrismaClient, Book, Order, OrderItem, Genre, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface TransactionItem {
  book_id: string;
  quantity: number;
}

interface TransactionRequest {
  user_id: string;
  items: TransactionItem[];
}

interface OrderWithDetails extends Order {
  user: User;
  orderItems: (OrderItem & {
    book: Book & {
      genre: Genre | null;
    };
  })[];
}

type GenreStats = {
  [key: string]: number;
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan.",
      });
    }

    const { user_id, items } = req.body as TransactionRequest;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body: user_id dan items wajib diisi",
      });
    }

    // Validasi setiap item dalam array
    for (const item of items) {
      if (!item.book_id || typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Setiap item harus memiliki book_id dan quantity (number positif)",
        });
      }

      // Cek ketersediaan buku
      const book = await prisma.book.findUnique({
        where: { id: item.book_id }
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Buku dengan ID ${item.book_id} tidak ditemukan`,
        });
      }
    }

    // Generate unique order ID
    const baseId = `${user_id}-${Date.now()}`;
    const hashedId = await bcrypt.hash(baseId, 10);

    // Create transaction in orders table
    const order = await prisma.order.create({
      data: {
        id: hashedId,
        userId: user_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map((item) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            bookId: item.book_id,
            quantity: item.quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      data: {
        order,
        items: orderItems,
      },
    });
  } catch (error: any) {
    console.error("Error dalam membuat transaksi:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan.",
      });
    }

    // Ambil query param
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || ""; // search by username
    const orderById = (req.query.orderById as "asc" | "desc") || "asc";
    const orderByAmount = (req.query.orderByAmount as "asc" | "desc") || "asc";

    const skip = (page - 1) * limit;

    // Ambil data dengan filter search dan sorting
    const transactions = await prisma.order.findMany({
      skip,
      take: limit,
      where: {
        user: {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        orderItems: {
          include: {
            book: { select: { id: true, title: true, price: true } },
          },
        },
      },
      orderBy: [
        { id: orderById },
      ],
    }) as OrderWithDetails[];

    // Kalau mau sorting by total amount:
    if (orderByAmount) {
      transactions.sort((a: OrderWithDetails, b: OrderWithDetails) => {
        const totalA = a.orderItems.reduce((sum: number, item) => sum + item.quantity * item.book.price, 0);
        const totalB = b.orderItems.reduce((sum: number, item) => sum + item.quantity * item.book.price, 0);
        return orderByAmount === "asc" ? totalA - totalB : totalB - totalA;
      });
    }

    return res.status(200).json({
      success: true,
      message: "All transactions retrieved successfully",
      data: transactions,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan.",
      });
    }

    const { id } = req.params;

    // Validasi input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Parameter id wajib diisi",
      });
    }

    // Cari transaksi berdasarkan ID
    const transaction = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        orderItems: {
          include: {
            book: {
              select: { id: true, title: true, price: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error: any) {
    console.error("ERROR DETAIL:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// // GET statistik transaksi
export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan.",
      });
    }
    
    // Ambil semua transaksi lengkap dengan item dan buku + genre
    const transactions = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            book: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No transactions found",
        data: {
          totalTransactions: 0,
          avgTransactionValue: 0,
          topGenre: null,
          leastGenre: null,
        },
      });
    }

    // Hitung total transaksi
    const totalTransactions = transactions.length;

    // Hitung nominal tiap transaksi
    const transactionTotals = transactions.map((t) =>
      t.orderItems.reduce(
        (sum: number, item) => sum + item.quantity * item.book.price,
        0
      )
    );

    // Rata-rata nominal tiap transaksi
    const avgTransactionValue =
      transactionTotals.reduce((a, b) => a + b, 0) / totalTransactions;

    // Hitung jumlah transaksi per genre
    const genreStats: Record<string, number> = {};
    transactions.forEach((t) => {
      const uniqueGenres = new Set(
        t.orderItems.map((item) => item.book.genre?.name)
      );
      uniqueGenres.forEach((genre) => {
        if (!genre) return;
        genreStats[genre] = (genreStats[genre] || 0) + 1;
      });
    });

    // Cari genre terbanyak dan tersedikit
    let topGenre = null;
    let leastGenre = null;
    if (Object.keys(genreStats).length > 0) {
      const sortedGenres = Object.entries(genreStats).sort(
        (a, b) => b[1] - a[1]
      );
      topGenre = { genre: sortedGenres[0][0], count: sortedGenres[0][1] };
      leastGenre = {
        genre: sortedGenres[sortedGenres.length - 1][0],
        count: sortedGenres[sortedGenres.length - 1][1],
      };
    }

    return res.status(200).json({
      success: true,
      message: "Transaction statistics retrieved successfully",
      data: {
        totalTransactions,
        avgTransactionValue,
        topGenre,
        leastGenre,
      },
    });
  } catch (error: any) {
    console.error("ERROR DETAIL:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Test helper: create transaction WITHOUT auth (for local testing only)
// WARNING: keep this disabled in production. Use only for debugging.
export const createTransactionNoAuth = async (req: Request, res: Response) => {
  try {
    const { user_id, items } = req.body as TransactionRequest;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body: user_id dan items wajib diisi",
      });
    }

    // Validasi setiap item dalam array
    for (const item of items) {
      if (!item.book_id || typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Setiap item harus memiliki book_id dan quantity (number positif)",
        });
      }

      // Cek ketersediaan buku
      const book = await prisma.book.findUnique({
        where: { id: item.book_id }
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Buku dengan ID ${item.book_id} tidak ditemukan`,
        });
      }
    }

    // Generate unique order ID
    const baseId = `${user_id}-${Date.now()}`;
    const hashedId = await bcrypt.hash(baseId, 10);

    // Create transaction in orders table
    const order = await prisma.order.create({
      data: {
        id: hashedId,
        userId: user_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map((item) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            bookId: item.book_id,
            quantity: item.quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: "(TEST) Transaksi berhasil dibuat",
      data: {
        order,
        items: orderItems,
      },
    });
  } catch (error: any) {
    console.error("Error dalam membuat transaksi (no-auth):", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};