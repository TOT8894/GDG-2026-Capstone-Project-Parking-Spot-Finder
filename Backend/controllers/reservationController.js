import Parking from "../models/parkingModel.js";
import Reservation from "../models/reservationModel.js";

export const reserveParking = async (req, res) => {
  try {
    const { userId, parkingId } = req.body;

    // 1. Check parking exists
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({ success: false, message: "Parking spot not found" });
    }

    // 2. Check available slots
    if (parking.availableSlots < 1) {
      return res.status(400).json({ success: false, message: "No slots available" });
    }

    // 3. Create reservation
    const reservation = await Reservation.create({ userId, parkingId });

    // 4. Decrement available slots
    parking.availableSlots -= 1;
    await parking.save();

    // 5. Respond
    res.json({
      success: true,
      message: "Reservation confirmed",
      reservationId: reservation._id,
      availableSlots: parking.availableSlots
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};