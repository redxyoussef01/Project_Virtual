import { Product } from "./entity/product";
import { Emplacement } from "./entity/emplacement";
import { Not } from "typeorm";
module.exports = function (app, AppDataSource) {
  app.post("/products", async (req, res) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const prodt = new Product();
      prodt.name = req.body.name;
      prodt.classe = req.body.classe;
      const result = await productRepository.save(prodt);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/products", async (req, res) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find();
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/products/:id", async (req, res) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOneBy({ id: req.params.id });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/products/:id", async (req, res) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOneBy({ id: req.params.id });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      product.name = req.body.name;
      product.classe = req.body.classe;
      const result = await productRepository.save(product);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/products/:id", async (req, res) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOneBy({ id: req.params.id });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      await productRepository.remove(product);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/emplacements0", async (req, res) => {
    try {
      const emplacementRepository = AppDataSource.getRepository(Emplacement);
      const emplacements = await emplacementRepository.find({
        relations: ["product"],
        where: {
          qte: Not(0),
        },
      });
      return res.status(200).json(emplacements);
    } catch (error) {
      console.error("Error fetching emplacements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app.get("/emplacements", async (req, res) => {
    try {
      const emplacementRepository = AppDataSource.getRepository(Emplacement);
      const emplacements = await emplacementRepository.find({
        relations: ["product"],
      });
      return res.status(200).json(emplacements);
    } catch (error) {
      console.error("Error fetching emplacements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/emplacements/:id", async (req, res) => {
    try {
      const emplacement = await AppDataSource.manager.findOne(Emplacement, {
        where: { id: req.params.id },
        relations: ["product"],
      });
      if (!emplacement) {
        return res.status(404).json({ error: "Emplacement not found" });
      }
      return res.status(200).json(emplacement);
    } catch (error) {
      console.error("Error fetching emplacement:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/emplacements/:id", async (req, res) => {
    try {
      const emplacementRepository = AppDataSource.getRepository(Emplacement);
      const { name, qte, productId } = req.body;

      const emplacement = await AppDataSource.manager.findOne(Emplacement, {
        where: { id: req.params.id },
      });

      if (!emplacement) {
        return res.status(404).json({ error: "Emplacement not found" });
      }

      // Update fields
      if (name) {
        emplacement.name = name;
      }

      if (qte) {
        emplacement.qte = qte;
      }

      // Update associated product if productId is provided
      if (productId) {
        const product = await AppDataSource.manager.findOne(Product, {
          where: { id: productId },
        });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        emplacement.product = product;
      }

      const result = await emplacementRepository.save(emplacement);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating emplacement:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
