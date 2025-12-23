# EPUB Hyphenator - Deployment Guide

## Production Deployment Requirements

### CLI Tool Dependency

The EPUB Hyphenator application depends on the `epub-hyphen` command-line tool for EPUB file processing. This tool must be installed and available in the production environment.

#### Installation Options

1. **Global npm Installation**:

   ```bash
   npm install -g epub-hyphen
   ```

2. **System Package Manager** (if available):

   ```bash
   # Example for apt-based systems
   sudo apt-get install epub-hyphen

   # Example for brew-based systems
   brew install epub-hyphen
   ```

3. **Docker Container** (recommended for production):

   ```dockerfile
   FROM node:latest

   # Install CLI tool
   RUN npm install -g epub-hyphen

   # Copy application files
   COPY . /app
   WORKDIR /app

   # Install dependencies
   RUN npm install

   # Build application
   RUN npm run build

   # Start server
   CMD ["npm", "run", "preview"]
   ```

#### Verification

After installation, verify the tool is available:

```bash
epub-hyphen --version
```

### Server Requirements

#### Minimum Requirements

- **Node.js**: Version 18+ (required for child process execution)
- **Memory**: 2GB+ (for handling 50MB EPUB files)
- **Storage**: Sufficient space for temporary files
- **File System**: Write access to `/tmp` directory

#### Recommended Configuration

- **CPU**: 2+ cores
- **Memory**: 4GB+
- **Storage**: SSD for better performance
- **OS**: Linux (Ubuntu/Debian recommended)
- **CLI Tool**: `epub-hyphen` v1.0+ installed globally

### Deployment Process

#### 1. Build Application

```bash
npm run build
```

#### 2. Install Dependencies

```bash
npm install --production
```

#### 3. Install CLI Tool

```bash
npm install -g epub-hyphen
```

#### 4. Configure Environment

```bash
# Set environment variables if needed
export NODE_ENV=production
export PORT=3000
```

#### 5. Start Server

```bash
npm run preview
```

### Configuration Options

#### Environment Variables

```env
# Server configuration
PORT=3000
HOST=0.0.0.0

# File processing
MAX_FILE_SIZE=50 # MB
TEMP_DIR=/tmp   # Temporary file directory

# Security
CORS_ORIGIN=https://yourdomain.com

# CLI Tool Configuration
EPUB_HYPHEN_PATH=/usr/local/bin/epub-hyphen
EPUB_HYPHEN_TIMEOUT=30000 # 30 seconds
```

#### Security Considerations

1. **File Upload Security**:
   - Validate file types and sizes
   - Use temporary files with secure naming
   - Clean up files after processing

2. **CLI Execution Security**:
   - Properly escape command arguments
   - Limit execution time and resources
   - Monitor for suspicious activity

3. **Network Security**:
   - Use HTTPS in production
   - Implement rate limiting
   - Set proper CORS headers

### Monitoring and Maintenance

#### Error Monitoring

- **Logging**: Implement comprehensive error logging
- **Alerting**: Set up alerts for critical failures
- **Metrics**: Track processing times and success rates

#### Performance Monitoring

- **Memory Usage**: Monitor for memory leaks
- **CPU Usage**: Track processing resource usage
- **Response Times**: Measure API response performance

#### Maintenance Tasks

- **Regular Updates**: Keep CLI tool and dependencies updated
- **Backup Strategy**: Regular backups of configuration
- **Security Patches**: Apply security updates promptly

### Troubleshooting

#### Common Issues

1. **CLI Tool Not Found**:
   - Verify installation: `epub-hyphen --version`
   - Check PATH environment variable
   - Reinstall if necessary

2. **File Processing Failures**:
   - Check file permissions
   - Verify temporary directory exists
   - Test with different EPUB files

3. **Memory Issues**:
   - Monitor memory usage
   - Consider smaller file size limits
   - Optimize CLI tool configuration

4. **Permission Errors**:
   - Ensure proper file system permissions
   - Check user running the application
   - Verify temporary directory access

### Scaling Considerations

#### Horizontal Scaling

- **Load Balancing**: Distribute requests across multiple instances
- **Stateless Design**: Ensure application is stateless
- **Session Management**: Use external session storage if needed

#### Vertical Scaling

- **Resource Allocation**: Increase CPU and memory
- **Performance Tuning**: Optimize Node.js configuration
- **CLI Tool Optimization**: Configure for better performance

### Backup and Recovery

#### Backup Strategy

- **Configuration**: Regular backups of configuration files
- **Database**: If using database, implement regular backups
- **Logs**: Archive important log files

#### Recovery Procedures

1. **Application Failure**:
   - Restart application
   - Check logs for errors
   - Verify dependencies

2. **Data Loss**:
   - Restore from backups
   - Verify file integrity
   - Test recovery process

3. **Security Incident**:
   - Isolate affected systems
   - Investigate root cause
   - Apply security patches

This deployment guide provides comprehensive instructions for setting up the EPUB Hyphenator application in production environments, ensuring proper configuration, security, and maintenance.
