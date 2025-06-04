from fastapi import FastAPI, HTTPException
from model_utils import make_prediction

app = FastAPI()

@app.get("/predict")
def predict(symbol: str):
    try:
        result = make_prediction(symbol.upper())
        return {"symbol": symbol.upper(), "predictions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))