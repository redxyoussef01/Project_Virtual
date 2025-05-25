import "reflect-metadata";
import { DataSource } from "typeorm";
import { Emplacement } from "./entity/emplacement";
import { Product } from "./entity/product";

console.log("Database connection configuration:", {
  host: process.env.DB_HOST || "mysql-service",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "appuser",
  database: process.env.DB_NAME || "3dapplication"
});

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "mysql-service",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "appuserpass",
  database: process.env.DB_NAME || "3dapplication",
  synchronize: true,
  logging: true,
  entities: [Product, Emplacement],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
    await saveEmplacements();
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

async function saveEmplacements() {
  try {
    const emplacementRepository = AppDataSource.getRepository(Emplacement);
    
    // Check if any emplacements exist
    const existingEmplacements = await emplacementRepository.count();
    
    if (existingEmplacements > 0) {
      console.log("Emplacements already exist in the database. Skipping initialization.");
      return;
    }

    console.log("No emplacements found. Initializing database...");
    
    for (
      let m = -10.5, charCode = 65;
      m < 27 && charCode <= 74;
      m += 4, charCode++
    ) {
      // 74 is the ASCII code for 'J'
      for (let n = 0; n < 2; n++) {
        for (let i = -1; i < 8; i++) {
          for (let j = -6; j < 7; j++) {
            const emplacement = new Emplacement();
            emplacement.x = m + n;
            emplacement.y = i;
            emplacement.z = j;
            emplacement.name = `${String.fromCharCode(charCode)}${i + 1}${j + 1}`;
            emplacement.qte = 0;

            await emplacementRepository.save(emplacement);
          }
        }
      }
    }

    console.log("Emplacements saved successfully!");
  } catch (error) {
    console.error("Error saving emplacements:", error);
  }
}

/*
async function saveEmplacements() {
  try {
    await AppDataSource.initialize();
    const emplacementRepository = AppDataSource.getRepository(Emplacement);

    for (
      let m = -10.5, charCode = 65;
      m < 27 && charCode <= 74;
      m += 4, charCode++
    ) {
      // 74 is the ASCII code for 'J'
      for (let n = 0; n < 2; n++) {
        for (let i = -1; i < 8; i++) {
          for (let j = -6; j < 7; j++) {
            const emplacement = new Emplacement();
            emplacement.x = m + n;
            emplacement.y = i;
            emplacement.z = j;
            emplacement.name = `${String.fromCharCode(charCode)}${i + 1}${
              j + 1
            }`;

            await emplacementRepository.save(emplacement);
          }
        }
      }
    }

    await AppDataSource.destroy();
    console.log("Emplacements saved successfully!");
  } catch (error) {
    console.error("Error saving emplacements:", error);
  }
}

saveEmplacements();

*/