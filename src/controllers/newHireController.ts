import { Request, Response } from "express";
import { NewHireModel } from "../models/newHireModel";

// Create a new hire
export const createNewHire = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('createNewHire',req.body);
    
    const newHire = new NewHireModel(req.body);
    const savedNewHire = await newHire.save();
    res.status(201).json(savedNewHire);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get all new hires
export const getAllNewHires = async (req: Request, res: Response): Promise<void> => {
  try {
    const newHires = await NewHireModel.find();
    res.json(newHires);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get a new hire by ID
export const getNewHireById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const newHire = await NewHireModel.findById(id);
    if (!newHire) {
      res.status(404).json({ message: "New hire not found" });
      return;
    }
    res.json(newHire);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Update a new hire by ID
export const updateNewHireById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedNewHire = await NewHireModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedNewHire) {
      res.status(404).json({ message: "New hire not found" });
      return;
    }
    res.json(updatedNewHire);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Delete a new hire by ID
export const deleteNewHireById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedNewHire = await NewHireModel.findByIdAndDelete(id);
    if (!deletedNewHire) {
      res.status(404).json({ message: "New hire not found" });
      return;
    }
    res.json({ message: "New hire deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};