#!/bin/bash
# deploy.sh — rubinite.xyz 部署（写部署标记 + wrangler deploy）
#
# 为什么有部署标记：巡检要能发现「线上版本 ≠ 本地 HEAD」
# （CI 断链 / 构建失败 / 有人本地 deploy 覆盖）。AnvilWiki 站由构建流程写
# /.well-known/anvilwiki-deploy.txt，这个静态站没有构建流程 → 这里补上。
set -e
cd "$(dirname "$0")"

SHA=$(git rev-parse HEAD)
mkdir -p public/.well-known
echo "$SHA" > public/.well-known/deploy.txt

export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897
npx wrangler deploy

echo ""
echo "✅ 已部署 rubinite.xyz @ $SHA"
echo "   验证: curl -s https://rubinite.xyz/.well-known/deploy.txt"
