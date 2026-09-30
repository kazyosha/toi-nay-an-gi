import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dishes = [
  ['Cơm tấm sườn bì chả', 'com-tam-suon-bi-cha', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85', 'RICE', 'Cơm tấm thơm với sườn nướng.', 1, 3],
  ['Cơm gà xối mỡ', 'com-ga-xoi-mo', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85', 'RICE', 'Gà giòn ăn cùng cơm nóng.', 0, 2],
  ['Phở bò', 'pho-bo', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=85', 'SOUP', 'Nước dùng thơm và thịt bò mềm.', 0, 3],
  ['Bún bò Huế', 'bun-bo-hue', 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=85', 'SOUP', 'Vị cay đậm đà kiểu Huế.', 2, 2],
  ['Mì Quảng', 'mi-quang', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85', 'NOODLE', 'Sợi mì vàng cùng rau và đậu phộng.', 1, 2],
  ['Hủ tiếu Nam Vang', 'hu-tieu-nam-vang', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=900&q=85', 'NOODLE', 'Tô hủ tiếu thanh vị.', 0, 2],
  ['Bánh mì thịt nướng', 'banh-mi-thit-nuong', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85', 'SNACK', 'Bánh mì giòn với thịt nướng.', 1, 3],
  ['Gỏi cuốn', 'goi-cuon', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', 'SNACK', 'Cuốn rau tươi nhẹ bụng.', 0, 1],
  ['Bánh xèo', 'banh-xeo', 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=900&q=85', 'SNACK', 'Vỏ bánh giòn, nhân tôm thịt.', 1, 2],
  ['Trà đào cam sả', 'tra-dao-cam-sa', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85', 'DRINK', 'Mát lạnh và thơm hương cam sả.', 0, 1],
  ['Cà phê sữa đá', 'ca-phe-sua-da', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85', 'DRINK', 'Ly cà phê đậm vị buổi chiều.', 0, 1],
  ['Cháo sườn', 'chao-suon', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85', 'OTHER', 'Món nóng êm bụng.', 0, 1],
] as const

async function main() {
  for (const [name, slug, imageUrl, category, description, spiceLevel, weight] of dishes) {
    await prisma.dish.upsert({
      where: { slug },
      update: { name, imageUrl, category, description, spiceLevel, weight, isActive: true },
      create: { name, slug, imageUrl, category, description, spiceLevel, weight, isActive: true },
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
