import { Router } from "express";

import {
    CreateComplain,
    UpdateStatusComplain,
    DeleteComplain,
    getComplain,
    escalateComplaint,
    getUserComplain
} from "../controlers/complain.controler.js";


const complainRouter = Router();


// Normal complaint
complainRouter
    .route("/create")
    .post(CreateComplain);


// AI → Human escalation
complainRouter
    .route("/escalate")
    .post(escalateComplaint);


// Get all complaints
complainRouter
    .route("/get")
    .get(getComplain);

complainRouter
    .route("/get-user-complain")
    .get(getUserComplain);


// Update complaint status
complainRouter
    .route("/update-status")
    .patch(UpdateStatusComplain);


// Delete complaint
complainRouter
    .route("/delete")
    .delete(DeleteComplain);


export default complainRouter;