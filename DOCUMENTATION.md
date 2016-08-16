## Classes

<dl>
<dt><a href="#BaseHelper">BaseHelper</a></dt>
<dd><p>Business Logic Helper Base class</p>
</dd>
<dt><a href="#Base">Base</a> ⇐ <code>Brick</code></dt>
<dd><p>Business Logic Base class</p>
</dd>
<dt><a href="#Get">Get</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Save class</p>
</dd>
<dt><a href="#Save">Save</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Save class</p>
</dd>
<dt><a href="#Execution">Execution</a> ⇐ <code><a href="#Base">Base</a></code></dt>
<dd><p>Business Logic Execution class</p>
</dd>
<dt><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></dt>
<dd><p>Database Interface Helper Base class</p>
</dd>
<dt><a href="#BaseDBInterface">BaseDBInterface</a> ⇐ <code>Brick</code></dt>
<dd><p>Database Interface Base class</p>
</dd>
<dt><a href="#Save">Save</a> ⇐ <code><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></code></dt>
<dd><p>Database Interface MongoDB Helper Save class</p>
</dd>
<dt><a href="#MongoDBInterface">MongoDBInterface</a> ⇐ <code><a href="#BaseDBInterface">BaseDBInterface</a></code></dt>
<dd><p>Database Interface MongoDB class</p>
</dd>
<dt><a href="#ExecutionsHandler">ExecutionsHandler</a></dt>
<dd><p>Handler class for RESTAPI handlers : EXECUTIONS</p>
</dd>
</dl>

<a name="BaseHelper"></a>

## BaseHelper
Business Logic Helper Base class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [BaseHelper](#BaseHelper)
    * [new BaseHelper(cementHelper, logger)](#new_BaseHelper_new)
    * *[._validate(context)](#BaseHelper+_validate) ⇒ <code>Promise</code>*
    * *[._process(context)](#BaseHelper+_process) ⇒ <code>Context</code>*

<a name="new_BaseHelper_new"></a>

### new BaseHelper(cementHelper, logger)
constructor - Create a new Business Logic Helper Base instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |

<a name="BaseHelper+_validate"></a>

### *baseHelper._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this Helper

**Kind**: instance abstract method of <code>[BaseHelper](#BaseHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_process"></a>

### *baseHelper._process(context) ⇒ <code>Context</code>*
Process the context

**Kind**: instance abstract method of <code>[BaseHelper](#BaseHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base"></a>

## Base ⇐ <code>Brick</code>
Business Logic Base class

**Kind**: global class  
**Extends:** <code>Brick</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [Base](#Base) ⇐ <code>Brick</code>
    * [new Base(cementHelper, configuration)](#new_Base_new)
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="new_Base_new"></a>

### new Base(cementHelper, configuration)
constructor - Create a new Business Logic Base instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |

<a name="Base+validate"></a>

### base.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Base](#Base)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base+process"></a>

### base.process(context)
Process the context

**Kind**: instance method of <code>[Base](#Base)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Get"></a>

## Get ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Save class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Get](#Get) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#BaseHelper+_validate) ⇒ <code>Promise</code>*
    * *[._process(context)](#BaseHelper+_process) ⇒ <code>Context</code>*

<a name="BaseHelper+_validate"></a>

### *get._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this Helper

**Kind**: instance abstract method of <code>[Get](#Get)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_process"></a>

### *get._process(context) ⇒ <code>Context</code>*
Process the context

**Kind**: instance abstract method of <code>[Get](#Get)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save"></a>

## Save ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Save class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Save](#Save) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Save+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Save+_process)
    * *[._validate(context)](#Save+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Save+_process)

<a name="Save+_validate"></a>

### *save._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Execution object fields

**Kind**: instance abstract method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save+_process"></a>

### save._process(context)
Process the context

**Kind**: instance method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save+_validate"></a>

### *save._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save+_process"></a>

### save._process(context)
Process the context

**Kind**: instance method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Execution"></a>

## Execution ⇐ <code>[Base](#Base)</code>
Business Logic Execution class

**Kind**: global class  
**Extends:** <code>[Base](#Base)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [Execution](#Execution) ⇐ <code>[Base](#Base)</code>
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="Base+validate"></a>

### execution.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Execution](#Execution)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base+process"></a>

### execution.process(context)
Process the context

**Kind**: instance method of <code>[Execution](#Execution)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseDBInterfaceHelper"></a>

## BaseDBInterfaceHelper
Database Interface Helper Base class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [BaseDBInterfaceHelper](#BaseDBInterfaceHelper)
    * [new BaseDBInterfaceHelper(cementHelper, logger)](#new_BaseDBInterfaceHelper_new)
    * *[._validate(context)](#BaseDBInterfaceHelper+_validate) ⇒ <code>Promise</code>*
    * *[._process(context)](#BaseDBInterfaceHelper+_process) ⇒ <code>Context</code>*

<a name="new_BaseDBInterfaceHelper_new"></a>

### new BaseDBInterfaceHelper(cementHelper, logger)
constructor - Create a new Database Interface Helper Base instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |

<a name="BaseDBInterfaceHelper+_validate"></a>

### *baseDBInterfaceHelper._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this Helper

**Kind**: instance abstract method of <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseDBInterfaceHelper+_process"></a>

### *baseDBInterfaceHelper._process(context) ⇒ <code>Context</code>*
Process the context

**Kind**: instance abstract method of <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseDBInterface"></a>

## BaseDBInterface ⇐ <code>Brick</code>
Database Interface Base class

**Kind**: global class  
**Extends:** <code>Brick</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [BaseDBInterface](#BaseDBInterface) ⇐ <code>Brick</code>
    * [new BaseDBInterface(cementHelper, configuration)](#new_BaseDBInterface_new)
    * [.validate(context)](#BaseDBInterface+validate) ⇒ <code>Promise</code>
    * [.process(context)](#BaseDBInterface+process)

<a name="new_BaseDBInterface_new"></a>

### new BaseDBInterface(cementHelper, configuration)
constructor - Create a new Database Interface Base instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |

<a name="BaseDBInterface+validate"></a>

### baseDBInterface.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[BaseDBInterface](#BaseDBInterface)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseDBInterface+process"></a>

### baseDBInterface.process(context)
Process the context

**Kind**: instance method of <code>[BaseDBInterface](#BaseDBInterface)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save"></a>

## Save ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
Database Interface MongoDB Helper Save class

**Kind**: global class  
**Extends:** <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Save](#Save) ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
    * *[._validate(context)](#Save+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Save+_process)
    * *[._validate(context)](#Save+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Save+_process)

<a name="Save+_validate"></a>

### *save._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Execution object fields

**Kind**: instance abstract method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save+_process"></a>

### save._process(context)
Process the context

**Kind**: instance method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save+_validate"></a>

### *save._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Save+_process"></a>

### save._process(context)
Process the context

**Kind**: instance method of <code>[Save](#Save)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="MongoDBInterface"></a>

## MongoDBInterface ⇐ <code>[BaseDBInterface](#BaseDBInterface)</code>
Database Interface MongoDB class

**Kind**: global class  
**Extends:** <code>[BaseDBInterface](#BaseDBInterface)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [MongoDBInterface](#MongoDBInterface) ⇐ <code>[BaseDBInterface](#BaseDBInterface)</code>
    * [.validate(context)](#BaseDBInterface+validate) ⇒ <code>Promise</code>
    * [.process(context)](#BaseDBInterface+process)

<a name="BaseDBInterface+validate"></a>

### mongoDBInterface.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[MongoDBInterface](#MongoDBInterface)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseDBInterface+process"></a>

### mongoDBInterface.process(context)
Process the context

**Kind**: instance method of <code>[MongoDBInterface](#MongoDBInterface)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="ExecutionsHandler"></a>

## ExecutionsHandler
Handler class for RESTAPI handlers : EXECUTIONS

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper from a cta-restapi Brick |


* [ExecutionsHandler](#ExecutionsHandler)
    * [new ExecutionsHandler(cementHelper)](#new_ExecutionsHandler_new)
    * [.save(req, res, next)](#ExecutionsHandler+save)

<a name="new_ExecutionsHandler_new"></a>

### new ExecutionsHandler(cementHelper)

| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper from a cta-restapi Brick |

<a name="ExecutionsHandler+save"></a>

### executionsHandler.save(req, res, next)
Publishes request body in an execution-save Context

**Kind**: instance method of <code>[ExecutionsHandler](#ExecutionsHandler)</code>  

| Param |
| --- |
| req | 
| res | 
| next | 

