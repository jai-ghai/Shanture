import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/User.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { firstname, lastname, email, phone, password } = req.body;

  if (!firstname || !lastname || !email || !phone || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User Already Exists", 409));
  }

  user = await User.create({ firstname, lastname, email, phone, password });

  const token = user.getJWTToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user,
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = user.getJWTToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

export const logout = catchAsyncError(async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    // Send the response after clearing the cookie
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(new ErrorHandler("Error logging out user"));
  }
});

export const loadUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// export const addUserPAN = catchAsyncError(async (req, res, next) => {
//   const { panNumber } = req.body;
//   const file = req.file;
//   console.log(panNumber, file);

//   if (!panNumber || !file) {
//     return next(
//       new ErrorHandler("Please provide PAN number and PAN card PDF", 400)
//     );
//   }

//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }

//     // Store the PAN card file in binary format
//     user.pancardNumber = panNumber;
//     user.panFile = file.buffer;

//     await user.save();
//     console.log("PAN card details saved successfully:", user);

//     res.status(200).json({
//       success: true,
//       message: "PAN card details added successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Error adding PAN card details:", error);
//     next(new ErrorHandler("Error adding PAN card details", 500));
//   }
// });

export const addUserPAN = catchAsyncError(async (req, res, next) => {
  const { panNumber } = req.body;
  const file = req.file;

  if (!panNumber || !file) {
    return next(
      new ErrorHandler("Please provide PAN number and PAN card PDF", 400)
    );
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Store the PAN card file in binary format
    user.pancardNumber = panNumber;
    user.panFile.data = file.buffer;
    user.panFile.contentType = file.mimetype;

    await user.save();
    console.log("PAN card details saved successfully:", user);

    res.status(200).json({
      success: true,
      message: "PAN card details added successfully",
      user,
    });
  } catch (error) {
    console.error("Error adding PAN card details:", error);
    next(new ErrorHandler("Error adding PAN card details", 500));
  }
});

export const downloadPANFile = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user || !user.panFile) {
    return next(new ErrorHandler("PAN card file not found", 404));
  }

  // Convert the binary data to a Buffer
  const bufferData = Buffer.from(user.panFile.data, "base64");

  // Set the response headers for downloading the PDF file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${user.pancardNumber}.pdf"`
  );

  // Send the PDF file as a downloadable attachment
  res.send(bufferData);
});
