import { Request, Response } from "express";
import db from "../database/db";

class DocumentTypeController {
  static async getAll(req: Request, res: Response): Promise<void> {
    // Fetch document types from database

    try {
      const documentTypes = await db.document_types.findAll();
      res.json(documentTypes);
    } catch (error) {
      console.error("Error fetching document types:", error);
      res.status(500).json({ message: "Internal server error" });
    }


  }

  static async create(req: Request, res: Response): Promise<void> {
    // Add a new document type to the database

    // TODO: Authentication check

    interface DocumentTypeRequest {
      name: string;
      description?: string;
      created_by: number;
    }

    const jsonReq: DocumentTypeRequest = req.body || {};

    if (!jsonReq.name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }
    // if (!created_by) { return res.status(400).json({ message: "Document type author ID is required" }); }

    try {
      await db.document_types.create({
        name: jsonReq.name,
        description: jsonReq.description,
        created_by: jsonReq.created_by,
      });
      res.status(200).json({ message: "Document type added successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to add document type", error });
    }
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Remove the document type from the database

    //TODO: Authentication check

    try {
      const documentType = await db.document_types.findOne({ where: { id } });
      if (!documentType) {
        res.status(404).json({ message: `Document type with ID ${id} not found` });
        return;
      }

      await db.document_types.destroy({ where: { id } });
    } catch (error) {
      console.error("Error removing document type:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.json({ message: `Document type ${id} removed` });
  }
}

export default DocumentTypeController;
