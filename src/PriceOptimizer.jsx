import { useState } from "react";

export const calcBestCombo = (pechos, piernas, costs) => {
  let best = null;

  const maxEnteros = Math.ceil(Math.max(pechos, piernas) / 2);
  const maxMedios = Math.max(pechos, piernas);

  for (let w = 0; w <= maxEnteros; w++) {
    for (let h = 0; h <= maxMedios; h++) {
      const remainingPechos = pechos - (2 * w + h);
      const remainingPiernas = piernas - (2 * w + h);
      if (remainingPechos < 0 || remainingPiernas < 0) continue;

      const qp = remainingPechos;
      const ql = remainingPiernas;

      const cost =
        w * costs.entero +
        h * costs.medio +
        qp * costs.cuartoPecho +
        ql * costs.cuartoPierna;

      const combo = {
        enteros: w,
        medios: h,
        cuartosPecho: qp,
        cuartosPierna: ql,
        cost,
      };

      if (!best || cost < best.cost) {
        best = combo;
      } else if (cost === best.cost) {
        const bestTuple = [
          best.cuartosPecho + best.cuartosPierna,
          best.medios,
          best.enteros,
        ];
        const thisTuple = [qp + ql, h, w];
        if (
          thisTuple[0] < bestTuple[0] ||
          (thisTuple[0] === bestTuple[0] &&
            (thisTuple[1] < bestTuple[1] ||
              (thisTuple[1] === bestTuple[1] && thisTuple[2] < bestTuple[2])))
        ) {
          best = combo;
        }
      }
    }
  }
  return best;
};

export default function PriceOptimizer() {
  const [pechos, setPechos] = useState("4");
  const [piernas, setPiernas] = useState("1");
  const [costs, setCosts] = useState(
    /** @type {Costs} */ {
      entero: 55,
      medio: 30,
      cuartoPecho: 18,
      cuartoPierna: 15,
    }
  );
  const [result, setResult] = useState(null);

  const handleOptimize = () => {
    const combo = calcBestCombo(
      parseInt(pechos, 10) || 0,
      parseInt(piernas, 10) || 0,
      costs
    );
    setResult(combo);
  };

  const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);
  const renderType = (count, typeSingular, typePlural, pechos, piernas) => {
    if (count === 0) return null;
    const parts = [];
    if (pechos > 0) parts.push(`${pechos} ${pluralize(pechos, "pecho", "pechos")}`);
    if (piernas > 0) parts.push(`${piernas} ${pluralize(piernas, "pierna", "piernas")}`);
    return (
      <p>
        {count} {pluralize(count, typeSingular, typePlural)}
        {parts.length > 0 && ` (${parts.join(", ")})`}
      </p>
    );
  };

  return (
    <div className="wrapper">
      <div className="input-section">
        <div className="section-header">Cantidad</div>
        <div className="input-group">
          <label className="input-label" htmlFor="pechos">Pechos</label>
          <input
            className="input-field"
            id="pechos"
            type="number"
            value={pechos}
            onChange={(e) => setPechos(e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="piernas">Piernas</label>
          <input
            className="input-field"
            id="piernas"
            type="number"
            value={piernas}
            onChange={(e) => setPiernas(e.target.value)}
            min="0"
          />
        </div>
      </div>
      <div className="input-section">
        <div className="section-header">Precio</div>
        <div className="input-group">
          <label className="input-label" htmlFor="entero">Entero</label>
          <input
            className="input-field"
            id="entero"
            type="number"
            value={costs.entero}
            min="0"
            onChange={(e) => setCosts({ ...costs, entero: parseFloat(e.target.value || "0") })}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="medio">Medio</label>
          <input
            className="input-field"
            id="medio"
            type="number"
            value={costs.medio}
            min="0"
            onChange={(e) => setCosts({ ...costs, medio: parseFloat(e.target.value || "0") })}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="cuartoPecho">¼ Pecho</label>
          <input
            className="input-field"
            id="cuartoPecho"
            type="number"
            value={costs.cuartoPecho}
            min="0"
            onChange={(e) => setCosts({ ...costs, cuartoPecho: parseFloat(e.target.value || "0") })}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="cuartoPierna">¼ Pierna</label>
          <input
            className="input-field"
            id="cuartoPierna"
            type="number"
            value={costs.cuartoPierna}
            min="0"
            onChange={(e) => setCosts({ ...costs, cuartoPierna: parseFloat(e.target.value || "0") })}
          />
        </div>
      </div>
      <button className="calculate-btn" onClick={handleOptimize}>Calcular</button>
      {result && (
        <div className="result">
          {renderType(
            result.enteros,
            "entero",
            "enteros",
            result.enteros * 2,
            result.enteros * 2
          )}
          {renderType(
            result.medios,
            "medio",
            "medios",
            result.medios * 1,
            result.medios * 1
          )}
          {renderType(
            result.cuartosPecho,
            "¼ pecho",
            "¼ pechos",
            result.cuartosPecho,
            0
          )}
          {renderType(
            result.cuartosPierna,
            "¼ pierna",
            "¼ piernas",
            0,
            result.cuartosPierna
          )}
          <p>
            <strong>Costo total: {result.cost.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

import "./PriceOptimizer.css";
