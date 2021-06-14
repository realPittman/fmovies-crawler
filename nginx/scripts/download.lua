local ID = ngx.var.FILE_ID
if ID == '' then
    ngx.log(ngx.ERR, "no ID found")
    return ngx.exit(400)
end

local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000) -- 1 second

local options_table = {}
options_table["pool"] = "redis"
local ok, err = red:connect("redis", 6379, options_table)
if not ok then
    ngx.log(ngx.ERR, "failed to connect to redis: ", err)
    return ngx.exit(500)
end

local target, err = red:get(ID)
if not target then
    ngx.log(ngx.ERR, "failed to find ID: ", err)
    return ngx.exit(500)
end

if target == ngx.null then
    ngx.log(ngx.ERR, "no target found for ID ", key)
    return ngx.exit(400)
end

ngx.var.TARGET_URL = target
