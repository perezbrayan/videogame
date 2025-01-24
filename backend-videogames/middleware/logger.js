const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Log request body if present
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }

    // Capture the original send function
    const originalSend = res.send;

    // Override the send function to log the response
    res.send = function(body) {
        console.log(`[${new Date().toISOString()}] Response:`, 
            typeof body === 'string' ? body : JSON.stringify(body, null, 2));
        originalSend.call(this, body);
    };

    next();
};

module.exports = logger;
