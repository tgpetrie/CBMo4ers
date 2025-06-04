#!/usr/bin/env bash
set -euo pipefail

# ⇒ invoke best-practices tool for Azure
azure_development-get_best_practices --target azure --task "deploy-containerized-app"

# 1) ensure Azure CLI is installed
if ! command -v az &> /dev/null; then
  echo "Installing Azure CLI via Homebrew…"
  brew update && brew install azure-cli
fi

# 2) interactive login
az login

# vars
RG="coinbase-movers-rg"
LOC="eastus"
ACR="coinbasemoversacr"
PLAN="coinbase-plan"
APP="coinbase-movers-app"
KV="coinbaseKV"
AI="coinbase-movers-ai"

# 3) resource group
az group create --name $RG --location $LOC

# 4) ACR (Basic)
az acr create --resource-group $RG --name $ACR --sku Basic

# 5) build & push
az acr build \
  --registry $ACR \
  --image coinbase-movers:latest \
  --file ./Dockerfile .

# 6) App Service plan (F1)
az appservice plan create \
  --name $PLAN \
  --resource-group $RG \
  --is-linux \
  --sku F1

# 7) Web App
az webapp create \
  --name $APP \
  --resource-group $RG \
  --plan $PLAN \
  --deployment-container-image-name $ACR.azurecr.io/coinbase-movers:latest

# 8) Key Vault + secret + grant access
az keyvault create --name $KV --resource-group $RG --location $LOC
az keyvault secret set --vault-name $KV --name COINBASE_API_KEY --value "<your-key>"
PRINCIPAL_ID=$(az webapp identity assign --name $APP --resource-group $RG --query principalId -o tsv)
az keyvault set-policy --name $KV --object-id $PRINCIPAL_ID --secret-permissions get

# 9) App Insights
az monitor app-insights component create --app $AI --location $LOC --resource-group $RG
INSTR_KEY=$(az monitor app-insights component show --app $AI --resource-group $RG --query instrumentationKey -o tsv)
az webapp config appsettings set \
  --name $APP \
  --resource-group $RG \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTR_KEY

echo "✅ Deployment complete: https://$APP.azurewebsites.net"

exit
