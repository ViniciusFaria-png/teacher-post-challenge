import { CheckCircle, Error, PlayArrow, Warning } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function TestDirectURL() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "quimica@fiap.com",
    senha: "123456",
  });

  const SERVER_URL = "https://blog-dinamico-app.onrender.com";

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    const tests = [
      {
        name: "Verificar se o servidor está online",
        test: async () => {
          const response = await axios.get(`${SERVER_URL}/`, {
            timeout: 10000,
            validateStatus: () => true,
          });
          return {
            success: response.status === 200,
            status: response.status,
            data: response.data,
            message:
              response.status === 200
                ? "Servidor online!"
                : "Servidor com problema",
          };
        },
      },
      {
        name: "Testar endpoint de login (POST /user/signin)",
        test: async () => {
          try {
            const response = await axios.post(
              `${SERVER_URL}/user/signin`,
              {
                email: credentials.email,
                senha: credentials.senha,
              },
              {
                timeout: 10000,
                headers: {
                  "Content-Type": "application/json",
                },
                validateStatus: () => true,
              },
            );

            return {
              success: response.status === 200,
              status: response.status,
              data: response.data,
              message:
                response.status === 200
                  ? "Login funcionando!"
                  : response.status === 405
                    ? "Método não permitido (405)"
                    : response.status === 401
                      ? "Credenciais inválidas (401)"
                      : `Erro ${response.status}`,
            };
          } catch (error: any) {
            return {
              success: false,
              status: error.response?.status || "ERROR",
              data: error.response?.data,
              message:
                error.code === "ERR_NETWORK"
                  ? "Erro de rede/CORS"
                  : error.message,
              error: error.message,
            };
          }
        },
      },
      {
        name: "Testar endpoint de posts (GET /posts)",
        test: async () => {
          try {
            const response = await axios.get(`${SERVER_URL}/posts`, {
              timeout: 10000,
              validateStatus: () => true,
            });

            return {
              success: response.status === 200,
              status: response.status,
              data: response.data,
              message:
                response.status === 200
                  ? "Posts acessíveis!"
                  : `Erro ${response.status}`,
            };
          } catch (error: any) {
            return {
              success: false,
              status: error.response?.status || "ERROR",
              data: error.response?.data,
              message:
                error.code === "ERR_NETWORK"
                  ? "Erro de rede/CORS"
                  : error.message,
            };
          }
        },
      },
      {
        name: "Verificar documentação Swagger (GET /docs)",
        test: async () => {
          try {
            const response = await axios.get(`${SERVER_URL}/docs`, {
              timeout: 10000,
              validateStatus: () => true,
            });

            return {
              success:
                response.status === 200 ||
                response.status === 301 ||
                response.status === 302,
              status: response.status,
              data:
                typeof response.data === "string"
                  ? "HTML/Swagger UI"
                  : response.data,
              message:
                response.status === 200
                  ? "Swagger disponível!"
                  : `Status ${response.status}`,
            };
          } catch (error: any) {
            return {
              success: false,
              status: "ERROR",
              message: "Swagger não acessível",
            };
          }
        },
      },
    ];

    for (const test of tests) {
      try {
        console.log(`Executando: ${test.name}`);
        const result = await test.test();
        setResults((prev) => [...prev, { name: test.name, ...result }]);
      } catch (error) {
        console.error(`Erro no teste ${test.name}:`, error);
        setResults((prev) => [
          ...prev,
          {
            name: test.name,
            success: false,
            message: "Erro inesperado",
            error: error,
          },
        ]);
      }

      // Pausa entre testes
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setLoading(false);
  };

  const getIcon = (result: any) => {
    if (result.success) return <CheckCircle color="success" />;
    if (result.status === 405) return <Warning color="warning" />;
    return <Error color="error" />;
  };

  const getSeverity = (result: any) => {
    if (result.success) return "success";
    if (result.status === 405) return "warning";
    return "error";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <PlayArrow sx={{ fontSize: "3rem", color: "primary.main", mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Teste da URL de Produção
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Testando: {SERVER_URL}
        </Typography>
      </Box>

      {/* Configuração de credenciais */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Credenciais para teste de login:
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            label="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            disabled={loading}
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={credentials.senha}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, senha: e.target.value }))
            }
            disabled={loading}
            fullWidth
          />
        </Box>
      </Paper>

      {/* Botão de teste */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={runTests}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
        >
          {loading ? "Executando testes..." : "Executar Todos os Testes"}
        </Button>
      </Box>

      {/* Resultados */}
      {results.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Resultados:
          </Typography>

          {results.map((result, index) => (
            <Alert
              key={index}
              severity={getSeverity(result)}
              icon={getIcon(result)}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                {result.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {result.status} - {result.message}
              </Typography>

              {result.data && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "rgba(0,0,0,0.1)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Resposta:
                  </Typography>
                  <pre
                    style={{
                      fontSize: "12px",
                      maxHeight: "200px",
                      overflow: "auto",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {typeof result.data === "string"
                      ? result.data.substring(0, 500) +
                        (result.data.length > 500 ? "..." : "")
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                </Box>
              )}
            </Alert>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* Diagnóstico */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Diagnóstico:
            </Typography>

            {results.find((r) => r.name.includes("login") && r.success) && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Login funcionando! O problema não é a URL ou o endpoint. O
                erro pode estar na implementação do frontend.
              </Alert>
            )}

            {results.find(
              (r) => r.name.includes("login") && r.status === 405,
            ) && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                ⚠️ Erro 405: O endpoint /user/signin existe mas não aceita POST.
                Verifique as rotas no backend.
              </Alert>
            )}

            {results.find(
              (r) => r.name.includes("login") && r.status === 401,
            ) && (
              <Alert severity="info" sx={{ mb: 2 }}>
                🔐 Erro 401: Endpoint funcionando mas credenciais inválidas.
                Tente outras credenciais ou registre um novo usuário.
              </Alert>
            )}

            {results.find((r) => r.message?.includes("CORS")) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                🚫 Problema de CORS: Configure o backend para aceitar
                requisições do frontend.
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>URL testada:</strong> {SERVER_URL}
              <br />
              <strong>Variável de ambiente:</strong> VITE_SERVER_URL=
              {SERVER_URL}
            </Typography>
          </Paper>
        </>
      )}
    </Container>
  );
}
