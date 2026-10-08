import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type SeedMealTime = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'LATE_NIGHT'
export type SeedCategory = 'RICE' | 'NOODLE' | 'SOUP' | 'SNACK' | 'DRINK' | 'OTHER'

export type SeedDish = {
  name: string
  slug: string
  imageUrl: string
  category: SeedCategory
  description: string
  spiceLevel: number
  weight: number
  isVegetarian: boolean
  priceLevel: number
  prepTimeMinutes: number
  mealTimes: readonly SeedMealTime[]
  isActive: boolean
}

const categoryImages: Record<SeedCategory, string> = {
  RICE: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
  NOODLE: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',
  SOUP: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=85',
  SNACK: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=900&q=85',
  DRINK: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85',
  OTHER: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
}

function dish(
  name: string,
  slug: string,
  category: SeedCategory,
  description: string,
  mealTimes: readonly SeedMealTime[],
  options: Partial<Pick<SeedDish, 'spiceLevel' | 'weight' | 'isVegetarian' | 'priceLevel' | 'prepTimeMinutes'>> = {},
): SeedDish {
  return {
    name,
    slug,
    imageUrl: categoryImages[category],
    category,
    description,
    mealTimes,
    spiceLevel: 0,
    weight: 1,
    isVegetarian: false,
    priceLevel: 1,
    prepTimeMinutes: 30,
    isActive: true,
    ...options,
  }
}

export const seedDishes: readonly SeedDish[] = [
  dish('Cơm tấm sườn bì chả', 'com-tam-suon-bi-cha', 'RICE', 'Cơm tấm thơm với sườn nướng, bì và chả trứng.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 3, priceLevel: 2, prepTimeMinutes: 25 }),
  dish('Cơm gà xối mỡ', 'com-ga-xoi-mo', 'RICE', 'Gà vàng giòn ăn cùng cơm nóng và đồ chua.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 2, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Cơm chiên Dương Châu', 'com-chien-duong-chau', 'RICE', 'Cơm chiên hạt rời với lạp xưởng, trứng và rau củ.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 15 }),
  dish('Cơm cá lóc kho tộ', 'com-ca-loc-kho-to', 'RICE', 'Cá lóc kho tộ đậm đà kiểu miền Tây ăn cùng cơm trắng.', ['LUNCH', 'DINNER'], { weight: 3, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 40 }),
  dish('Cơm thịt kho trứng', 'com-thit-kho-trung', 'RICE', 'Thịt ba rọi kho nước dừa với trứng vịt béo thơm.', ['LUNCH', 'DINNER'], { weight: 3, priceLevel: 2, prepTimeMinutes: 45 }),
  dish('Cơm tấm lòng xào', 'com-tam-long-xao', 'RICE', 'Cơm tấm ăn cùng lòng xào khóm và dưa chua.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 2, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Hủ tiếu Mỹ Tho', 'hu-tieu-my-tho', 'NOODLE', 'Hủ tiếu dai với tôm, thịt và nước dùng thanh ngọt.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 3, priceLevel: 2, prepTimeMinutes: 25 }),
  dish('Hủ tiếu Nam Vang', 'hu-tieu-nam-vang', 'NOODLE', 'Tô hủ tiếu đầy đặn với tôm, thịt bằm và trứng cút.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 3, priceLevel: 2, prepTimeMinutes: 25 }),
  dish('Hủ tiếu xào', 'hu-tieu-xao', 'NOODLE', 'Hủ tiếu xào mềm cùng rau cải, thịt và tôm.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 2, priceLevel: 2, prepTimeMinutes: 20 }),
  dish('Bún cá Châu Đốc', 'bun-ca-chau-doc', 'NOODLE', 'Bún cá lóc với nước lèo vàng thơm mắm ruốc miền Tây.', ['BREAKFAST', 'LUNCH'], { weight: 2, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Bún nước lèo Sóc Trăng', 'bun-nuoc-leo-soc-trang', 'NOODLE', 'Nước lèo mắm cá đậm vị với cá lóc, tôm và rau sống.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 2, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Bún mắm miền Tây', 'bun-mam-mien-tay', 'NOODLE', 'Bún mắm thơm nồng với cá, tôm, thịt heo quay và rau đồng.', ['LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 3, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 35 }),
  dish('Bún kèn Phú Quốc', 'bun-ken-phu-quoc', 'NOODLE', 'Bún cá nấu nước cốt dừa béo nhẹ, ăn cùng rau ghém.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 2, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Bún thịt nướng', 'bun-thit-nuong', 'NOODLE', 'Bún tươi với thịt nướng sả, đậu phộng và nước mắm chua ngọt.', ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 25 }),
  dish('Mì Quảng', 'mi-quang', 'NOODLE', 'Sợi mì vàng cùng thịt, tôm, rau sống và đậu phộng rang.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 2, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Bún bò Huế', 'bun-bo-hue', 'NOODLE', 'Nước dùng sả ớt đậm đà với bò mềm và chả cua.', ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, spiceLevel: 2, priceLevel: 2, prepTimeMinutes: 35 }),
  dish('Phở bò', 'pho-bo', 'NOODLE', 'Nước dùng thơm và thịt bò mềm, ăn kèm rau thơm.', ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 3, priceLevel: 2, prepTimeMinutes: 35 }),
  dish('Mì xào bò', 'mi-xao-bo', 'NOODLE', 'Mì xào bò với cải thìa, hành tây và nước sốt đậm vị.', ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 20 }),
  dish('Nui xào bò', 'nui-xao-bo', 'NOODLE', 'Nui xào bò mềm thơm, hợp cho bữa sáng nhanh gọn.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 1, priceLevel: 1, prepTimeMinutes: 20 }),
  dish('Bánh canh cua', 'banh-canh-cua', 'SOUP', 'Bánh canh bột lọc sánh nhẹ với cua, tôm và hành phi.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 2, priceLevel: 3, prepTimeMinutes: 30 }),
  dish('Bánh canh cá lóc', 'banh-canh-ca-loc', 'SOUP', 'Bánh canh cá lóc miền Tây với nước dùng ngọt thanh.', ['BREAKFAST', 'LUNCH', 'DINNER'], { weight: 2, priceLevel: 2, prepTimeMinutes: 30 }),
  dish('Cháo cá lóc', 'chao-ca-loc', 'SOUP', 'Cháo cá lóc nóng ấm, rắc hành tiêu và rau đắng.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 1, priceLevel: 1, prepTimeMinutes: 35 }),
  dish('Cháo lòng', 'chao-long', 'SOUP', 'Cháo gạo rang với lòng heo, tiêu và rau thơm.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 35 }),
  dish('Cháo sườn', 'chao-suon', 'SOUP', 'Món cháo sườn mềm mịn, êm bụng cho buổi tối.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 1, priceLevel: 1, prepTimeMinutes: 30 }),
  dish('Canh chua cá linh', 'canh-chua-ca-linh', 'SOUP', 'Canh chua cá linh với bông điên điển và me chua.', ['LUNCH', 'DINNER'], { weight: 2, spiceLevel: 1, priceLevel: 2, prepTimeMinutes: 35 }),
  dish('Lẩu mắm miền Tây', 'lau-mam-mien-tay', 'SOUP', 'Lẩu mắm đậm đà với cá, tôm, thịt và rau đồng.', ['LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 3, spiceLevel: 1, priceLevel: 3, prepTimeMinutes: 45 }),
  dish('Lẩu gà lá giang', 'lau-ga-la-giang', 'SOUP', 'Lẩu gà chua dịu lá giang, ăn cùng rau và bún.', ['LUNCH', 'DINNER'], { weight: 2, spiceLevel: 1, priceLevel: 3, prepTimeMinutes: 45 }),
  dish('Lẩu Thái hải sản', 'lau-thai-hai-san', 'SOUP', 'Nồi lẩu chua cay với tôm, mực và rau tươi.', ['LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, spiceLevel: 2, priceLevel: 3, prepTimeMinutes: 40 }),
  dish('Bánh xèo miền Tây', 'banh-xeo-mien-tay', 'SNACK', 'Bánh xèo vàng giòn, nhân tôm thịt và giá, cuốn rau sống.', ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 25 }),
  dish('Bánh khọt Vũng Tàu', 'banh-khot-vung-tau', 'SNACK', 'Bánh khọt giòn rụm với tôm, ăn cùng rau và nước mắm.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 1, priceLevel: 2, prepTimeMinutes: 25 }),
  dish('Bánh mì thịt nướng', 'banh-mi-thit-nuong', 'SNACK', 'Bánh mì giòn với thịt nướng sả, đồ chua và ngò.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 15 }),
  dish('Bánh mì ốp la', 'banh-mi-op-la', 'SNACK', 'Bánh mì nóng với trứng ốp la, pate và dưa leo.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 1, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Xôi mặn', 'xoi-man', 'SNACK', 'Xôi nếp dẻo với chà bông, lạp xưởng và hành phi.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 2, priceLevel: 1, prepTimeMinutes: 15 }),
  dish('Gỏi cuốn', 'goi-cuon', 'SNACK', 'Cuốn rau tươi, bún, tôm thịt chấm tương đậu phộng.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 1, priceLevel: 1, prepTimeMinutes: 20 }),
  dish('Gỏi ngó sen tôm thịt', 'goi-ngo-sen-tom-thit', 'SNACK', 'Ngó sen giòn trộn tôm thịt với nước mắm chua ngọt.', ['LUNCH', 'DINNER'], { weight: 1, priceLevel: 2, prepTimeMinutes: 25 }),
  dish('Gỏi gà bắp cải', 'goi-ga-bap-cai', 'SNACK', 'Gỏi gà xé phay với bắp cải, rau răm và đậu phộng.', ['LUNCH', 'DINNER'], { weight: 1, priceLevel: 2, prepTimeMinutes: 25 }),
  dish('Kho quẹt rau luộc', 'kho-quet-rau-luoc', 'SNACK', 'Kho quẹt tôm khô mặn ngọt dùng với rau củ luộc.', ['LUNCH', 'DINNER'], { weight: 1, spiceLevel: 1, priceLevel: 1, prepTimeMinutes: 20 }),
  dish('Cá lóc nướng trui', 'ca-loc-nuong-trui', 'OTHER', 'Cá lóc nướng trui cuốn bánh tráng với rau đồng.', ['LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 3, priceLevel: 2, prepTimeMinutes: 45 }),
  dish('Gà nướng muối ớt', 'ga-nuong-muoi-ot', 'OTHER', 'Gà nướng da vàng thơm, chấm muối ớt xanh.', ['LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, spiceLevel: 2, priceLevel: 2, prepTimeMinutes: 45 }),
  dish('Sườn nướng sả', 'suon-nuong-sa', 'OTHER', 'Sườn heo ướp sả nướng thơm, ăn cùng dưa chua.', ['LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 2, priceLevel: 2, prepTimeMinutes: 35 }),
  dish('Khoai mỡ chiên', 'khoai-mo-chien', 'SNACK', 'Khoai mỡ chiên giòn, chấm sốt me cay nhẹ.', ['LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 15 }),
  dish('Bánh bò nướng', 'banh-bo-nuong', 'SNACK', 'Bánh bò nướng cốt dừa thơm mềm, vị ngọt vừa.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 30 }),
  dish('Bánh tráng trộn', 'banh-trang-tron', 'SNACK', 'Bánh tráng trộn khô bò, xoài xanh, trứng cút và rau răm.', ['LUNCH', 'LATE_NIGHT'], { weight: 1, spiceLevel: 2, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Bắp xào mỡ hành', 'bap-xao-mo-hanh', 'SNACK', 'Bắp ngọt xào mỡ hành với tép khô và ruốc.', ['LUNCH', 'LATE_NIGHT'], { weight: 1, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Chè ba màu', 'che-ba-mau', 'DRINK', 'Chè đậu, thạch và nước cốt dừa mát ngọt.', ['LUNCH', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 15 }),
  dish('Sữa đậu nành', 'sua-dau-nanh', 'DRINK', 'Ly sữa đậu nành nóng hoặc lạnh, thơm nhẹ và dễ uống.', ['BREAKFAST', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Cà phê sữa đá', 'ca-phe-sua-da', 'DRINK', 'Cà phê phin đậm vị pha cùng sữa đặc và đá.', ['BREAKFAST', 'LUNCH', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Trà tắc mật ong', 'tra-tac-mat-ong', 'DRINK', 'Trà tắc chua ngọt, thơm mùi mật ong và vỏ tắc.', ['LUNCH', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Nước mía tắc', 'nuoc-mia-tac', 'DRINK', 'Nước mía ép tươi pha tắc, mát lạnh kiểu miền Tây.', ['LUNCH', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 10 }),
  dish('Trà sen', 'tra-sen', 'DRINK', 'Trà sen thanh nhẹ, dùng nóng hoặc thêm đá.', ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'], { weight: 1, isVegetarian: true, priceLevel: 1, prepTimeMinutes: 10 }),
] as const

export async function runSeed() {
  for (const sample of seedDishes) {
    const data = { ...sample, mealTimes: [...sample.mealTimes] }

    await prisma.dish.upsert({
      where: { slug: sample.slug },
      update: data,
      create: data,
    })
  }
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/prisma/seed.ts')) {
  runSeed()
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
    .finally(async () => prisma.$disconnect())
}
