#!/bin/bash
# Test script to verify navigation locale prefixes are working correctly

echo "Testing navigation locale prefixes..."

# Start the preview server in background
npm run preview &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test German blog page navigation links
echo "Testing German blog page navigation links..."
DE_BLOG_RESPONSE=$(curl -s http://localhost:4321/de/blog)

if echo "$DE_BLOG_RESPONSE" | grep -q 'href="/de/docs"'; then
    echo "✓ German docs link has correct locale prefix"
else
    echo "✗ German docs link is missing locale prefix"
    exit 1
fi

if echo "$DE_BLOG_RESPONSE" | grep -q 'href="/de/about"'; then
    echo "✓ German about link has correct locale prefix"  
else
    echo "✗ German about link is missing locale prefix"
    exit 1
fi

# Test English blog page navigation links
echo "Testing English blog page navigation links..."
EN_BLOG_RESPONSE=$(curl -s http://localhost:4321/en/blog)

if echo "$EN_BLOG_RESPONSE" | grep -q 'href="/en/docs"'; then
    echo "✓ English docs link has correct locale prefix"
else
    echo "✗ English docs link is missing locale prefix"
    exit 1
fi

if echo "$EN_BLOG_RESPONSE" | grep -q 'href="/en/about"'; then
    echo "✓ English about link has correct locale prefix"
else
    echo "✗ English about link is missing locale prefix"
    exit 1
fi

# Clean up
kill $SERVER_PID

echo "All navigation locale prefix tests passed! ✓"