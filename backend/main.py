from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.fraud import router as fraud_router
from routes.auth import router as auth_router
from routes.scam import router as scam_router
from routes.chatbot import router as chatbot_router
from routes.reports import router as reports_router
from routes.dashboard import router as dashboard_router
from routes.geo import router as geo_router
from routes.graph import router as graph_router
from database import engine, Base
import models
from routes.currency import router as currency_router

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SentinelAI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(scam_router, prefix="/api/scam", tags=["Scam"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])
app.include_router(

    fraud_router,

    prefix="/api/fraud",

    tags=["Fraud Shield"]

)
app.include_router(
    dashboard_router,
    prefix="/api/dashboard",
    tags=["Dashboard"]
)
app.include_router(
    geo_router,
    prefix="/api/geo",
    tags=["Geo Intelligence"]
)
app.include_router(
    graph_router,
    prefix="/api/graph",
    tags=["Graph Intelligence"]
)
app.include_router(
    currency_router,
    prefix="/api/currency",
    tags=["Currency Detection"]
)
@app.get("/")
def root():
    return {"message": "SentinelAI Backend Running"}