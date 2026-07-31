import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '../layout/app-layout';
import { DeploymentPage } from '../pages/deployment/DeploymentPage';
import { InformationPage } from '../pages/information/InformationPage';
import { MetaCostsPage } from '../pages/meta/MetaCostsPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { SummaryPage } from '../pages/summary/SummaryPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/calculadora/meta" replace />} />
          <Route path="/calculadora" element={<Navigate to="/calculadora/meta" replace />} />
          <Route path="/calculadora/meta" element={<MetaCostsPage />} />
          <Route path="/calculadora/produtos" element={<ProductsPage />} />
          <Route path="/calculadora/implantacao" element={<DeploymentPage />} />
          <Route path="/calculadora/resumo" element={<SummaryPage />} />
          <Route path="/calculadora/informacoes" element={<InformationPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/calculadora/meta" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

