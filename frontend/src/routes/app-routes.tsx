import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '../layout/app-layout';
import { InformationPage } from '../pages/information/InformationPage';
import { MetaCostsPage } from '../pages/meta/MetaCostsPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { SummaryPage } from '../pages/summary/SummaryPage';
import { ProposalPreviewPage } from '../pages/proposal/ProposalPreviewPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/proposta"
          element={<ProposalPreviewPage />}
        />
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Navigate
                to="/calculadora/informacoes"
                replace
              />
            }
          />
          <Route
            path="/calculadora"
            element={
              <Navigate
                to="/calculadora/informacoes"
                replace
              />
            }
          />
          <Route
            path="/calculadora/meta"
            element={<MetaCostsPage />}
          />
          <Route
            path="/calculadora/produtos"
            element={<ProductsPage />}
          />
          <Route
            path="/calculadora/resumo"
            element={<SummaryPage />}
          />
          <Route
            path="/calculadora/informacoes"
            element={<InformationPage />}
          />
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to="/calculadora/informacoes"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
