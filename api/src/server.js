import app from "./app/app.js";
import connectDb from "./config/db.js";

const port = process.env.PORT || 5000



const startServer = async () => {
  try {

    await connectDb()
    app.listen(3000, () => {
      console.log(`server is running on ${port}`);
    })

  } catch (error) {

    console.error("Failed to start server:", error.message);
    process.exit(1);

  }

}

startServer()