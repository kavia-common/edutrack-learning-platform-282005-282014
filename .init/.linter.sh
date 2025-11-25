#!/bin/bash
cd /home/kavia/workspace/code-generation/edutrack-learning-platform-282005-282014/frontend_lms
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

