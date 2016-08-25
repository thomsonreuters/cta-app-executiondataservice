## Classes

<dl>
<dt><a href="#BaseHelper">BaseHelper</a></dt>
<dd><p>Business Logic Helper Base class</p>
</dd>
<dt><a href="#Base">Base</a> ⇐ <code>Brick</code></dt>
<dd><p>Business Logic Base class</p>
</dd>
<dt><a href="#Create">Create</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Create class</p>
</dd>
<dt><a href="#Delete">Delete</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Delete class</p>
</dd>
<dt><a href="#Find">Find</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Find class</p>
</dd>
<dt><a href="#FindById">FindById</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper FindById class</p>
</dd>
<dt><a href="#Update">Update</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Update class</p>
</dd>
<dt><a href="#Execution">Execution</a> ⇐ <code><a href="#Base">Base</a></code></dt>
<dd><p>Business Logic Execution class</p>
</dd>
<dt><a href="#Execution">Execution</a></dt>
<dd><p>Execution Data Model class</p>
</dd>
<dt><a href="#Create">Create</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Status Helper Create class</p>
</dd>
<dt><a href="#Delete">Delete</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Status Helper Delete class</p>
</dd>
<dt><a href="#Update">Update</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Status Helper Update class</p>
</dd>
<dt><a href="#Status">Status</a> ⇐ <code><a href="#Base">Base</a></code></dt>
<dd><p>Business Logic Status class</p>
</dd>
<dt><a href="#Status">Status</a></dt>
<dd><p>Status Data Model class</p>
</dd>
<dt><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></dt>
<dd><p>Database Interface Helper Base class</p>
</dd>
<dt><a href="#BaseDBInterface">BaseDBInterface</a> ⇐ <code>Brick</code></dt>
<dd><p>Database Interface Base class</p>
</dd>
<dt><a href="#DeleteOne">DeleteOne</a> ⇐ <code><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></code></dt>
<dd><p>Database Interface MongoDB Helper DeleteOne class</p>
</dd>
<dt><a href="#Find">Find</a> ⇐ <code><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></code></dt>
<dd><p>Database Interface MongoDB Helper Find class</p>
</dd>
<dt><a href="#FindById">FindById</a> ⇐ <code><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></code></dt>
<dd><p>Database Interface MongoDB Helper FindById class</p>
</dd>
<dt><a href="#InsertOne">InsertOne</a> ⇐ <code><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></code></dt>
<dd><p>Database Interface MongoDB Helper InsertOne class</p>
</dd>
<dt><a href="#UpdateOne">UpdateOne</a> ⇐ <code><a href="#BaseDBInterfaceHelper">BaseDBInterfaceHelper</a></code></dt>
<dd><p>Database Interface MongoDB Helper UpdateOne class</p>
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
    * [._ack(context)](#BaseHelper+_ack)

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

<a name="BaseHelper+_ack"></a>

### baseHelper._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[BaseHelper](#BaseHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

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

<a name="Create"></a>

## Create ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Create class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Create](#Create) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Create+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Create+_process)
    * *[._validate(context)](#Create+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Create+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Create+_validate"></a>

### *create._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Execution Model fields

**Kind**: instance abstract method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Create+_process"></a>

### create._process(context)
Process the context

**Kind**: instance method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Create+_validate"></a>

### *create._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Status Model fields

**Kind**: instance abstract method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Create+_process"></a>

### create._process(context)
Process the context

**Kind**: instance method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### create._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_ack](#BaseHelper+_ack)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="Delete"></a>

## Delete ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Delete class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Delete](#Delete) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Delete+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Delete+_process)
    * *[._validate(context)](#Delete+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Delete+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Delete+_validate"></a>

### *delete._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Execution Model fields

**Kind**: instance abstract method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Delete+_process"></a>

### delete._process(context)
Process the context

**Kind**: instance method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Delete+_validate"></a>

### *delete._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Status Model fields

**Kind**: instance abstract method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Delete+_process"></a>

### delete._process(context)
Process the context

**Kind**: instance method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### delete._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_ack](#BaseHelper+_ack)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="Find"></a>

## Find ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Find class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Find](#Find) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Find+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Find+_process)
    * *[._validate(context)](#Find+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Find+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Find+_validate"></a>

### *find._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Execution Model fields

**Kind**: instance abstract method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find+_process"></a>

### find._process(context)
Process the context

**Kind**: instance method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find+_validate"></a>

### *find._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find+_process"></a>

### find._process(context)
Process the context

**Kind**: instance method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### find._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Find](#Find)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="FindById"></a>

## FindById ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper FindById class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [FindById](#FindById) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#FindById+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#FindById+_process)
    * *[._validate(context)](#FindById+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#FindById+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="FindById+_validate"></a>

### *findById._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Execution Model fields

**Kind**: instance abstract method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="FindById+_process"></a>

### findById._process(context)
Process the context

**Kind**: instance method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="FindById+_validate"></a>

### *findById._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="FindById+_process"></a>

### findById._process(context)
Process the context

**Kind**: instance method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### findById._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[FindById](#FindById)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="Update"></a>

## Update ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Update class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Update](#Update) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Update+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Update+_process)
    * *[._validate(context)](#Update+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Update+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Update+_validate"></a>

### *update._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Execution Model fields

**Kind**: instance abstract method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Update+_process"></a>

### update._process(context)
Process the context

**Kind**: instance method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Update+_validate"></a>

### *update._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Status Model fields

**Kind**: instance abstract method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Update+_process"></a>

### update._process(context)
Process the context

**Kind**: instance method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### update._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_ack](#BaseHelper+_ack)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

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
    * [new Execution(data)](#new_Execution_new)
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="new_Execution_new"></a>

### new Execution(data)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | params |
| data.id | <code>ObjectID</code> | unique identifier |
| data.scenario | <code>ObjectID</code> | unique identifier of a Scenario |
| data.configuration | <code>ObjectID</code> | unique identifier of a Configuration |
| data.user | <code>ObjectID</code> | unique identifier of an User |

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

<a name="Execution"></a>

## Execution
Execution Data Model class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>ObjectID</code> | unique identifier |
| scenario | <code>ObjectID</code> | unique identifier of a Scenario |
| configuration | <code>ObjectID</code> | unique identifier of a Configuration |
| user | <code>ObjectID</code> | unique identifier of an User |


* [Execution](#Execution)
    * [new Execution(data)](#new_Execution_new)
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="new_Execution_new"></a>

### new Execution(data)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | params |
| data.id | <code>ObjectID</code> | unique identifier |
| data.scenario | <code>ObjectID</code> | unique identifier of a Scenario |
| data.configuration | <code>ObjectID</code> | unique identifier of a Configuration |
| data.user | <code>ObjectID</code> | unique identifier of an User |

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

<a name="Create"></a>

## Create ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Status Helper Create class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Create](#Create) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Create+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Create+_process)
    * *[._validate(context)](#Create+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Create+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Create+_validate"></a>

### *create._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Execution Model fields

**Kind**: instance abstract method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Create+_process"></a>

### create._process(context)
Process the context

**Kind**: instance method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Create+_validate"></a>

### *create._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Status Model fields

**Kind**: instance abstract method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Create+_process"></a>

### create._process(context)
Process the context

**Kind**: instance method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### create._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Create](#Create)</code>  
**Overrides:** <code>[_ack](#BaseHelper+_ack)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="Delete"></a>

## Delete ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Status Helper Delete class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Delete](#Delete) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Delete+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Delete+_process)
    * *[._validate(context)](#Delete+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Delete+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Delete+_validate"></a>

### *delete._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Execution Model fields

**Kind**: instance abstract method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Delete+_process"></a>

### delete._process(context)
Process the context

**Kind**: instance method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Delete+_validate"></a>

### *delete._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Status Model fields

**Kind**: instance abstract method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Delete+_process"></a>

### delete._process(context)
Process the context

**Kind**: instance method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### delete._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Delete](#Delete)</code>  
**Overrides:** <code>[_ack](#BaseHelper+_ack)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="Update"></a>

## Update ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Status Helper Update class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Update](#Update) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * *[._validate(context)](#Update+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Update+_process)
    * *[._validate(context)](#Update+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Update+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Update+_validate"></a>

### *update._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Execution Model fields

**Kind**: instance abstract method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Update+_process"></a>

### update._process(context)
Process the context

**Kind**: instance method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Update+_validate"></a>

### *update._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Status Model fields

**Kind**: instance abstract method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Update+_process"></a>

### update._process(context)
Process the context

**Kind**: instance method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### update._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Update](#Update)</code>  
**Overrides:** <code>[_ack](#BaseHelper+_ack)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="Status"></a>

## Status ⇐ <code>[Base](#Base)</code>
Business Logic Status class

**Kind**: global class  
**Extends:** <code>[Base](#Base)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [Status](#Status) ⇐ <code>[Base](#Base)</code>
    * [new Status(data)](#new_Status_new)
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="new_Status_new"></a>

### new Status(data)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | params |
| data.id | <code>ObjectID</code> | unique identifier |
| data.scenario | <code>ObjectID</code> | unique identifier of a Scenario |
| data.configuration | <code>ObjectID</code> | unique identifier of a Configuration |
| data.user | <code>ObjectID</code> | unique identifier of an User |

<a name="Base+validate"></a>

### status.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Status](#Status)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base+process"></a>

### status.process(context)
Process the context

**Kind**: instance method of <code>[Status](#Status)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Status"></a>

## Status
Status Data Model class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>ObjectID</code> | unique identifier |
| scenario | <code>ObjectID</code> | unique identifier of a Scenario |
| configuration | <code>ObjectID</code> | unique identifier of a Configuration |
| user | <code>ObjectID</code> | unique identifier of an User |


* [Status](#Status)
    * [new Status(data)](#new_Status_new)
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="new_Status_new"></a>

### new Status(data)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | params |
| data.id | <code>ObjectID</code> | unique identifier |
| data.scenario | <code>ObjectID</code> | unique identifier of a Scenario |
| data.configuration | <code>ObjectID</code> | unique identifier of a Configuration |
| data.user | <code>ObjectID</code> | unique identifier of an User |

<a name="Base+validate"></a>

### status.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Status](#Status)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base+process"></a>

### status.process(context)
Process the context

**Kind**: instance method of <code>[Status](#Status)</code>  

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

<a name="DeleteOne"></a>

## DeleteOne ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
Database Interface MongoDB Helper DeleteOne class

**Kind**: global class  
**Extends:** <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [DeleteOne](#DeleteOne) ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
    * *[._validate(context)](#DeleteOne+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#DeleteOne+_process)

<a name="DeleteOne+_validate"></a>

### *deleteOne._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[DeleteOne](#DeleteOne)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="DeleteOne+_process"></a>

### deleteOne._process(context)
Process the context

**Kind**: instance method of <code>[DeleteOne](#DeleteOne)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find"></a>

## Find ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
Database Interface MongoDB Helper Find class

**Kind**: global class  
**Extends:** <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Find](#Find) ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
    * *[._validate(context)](#Find+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Find+_process)
    * *[._validate(context)](#Find+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#Find+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="Find+_validate"></a>

### *find._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Execution Model fields

**Kind**: instance abstract method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find+_process"></a>

### find._process(context)
Process the context

**Kind**: instance method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find+_validate"></a>

### *find._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Find+_process"></a>

### find._process(context)
Process the context

**Kind**: instance method of <code>[Find](#Find)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### find._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[Find](#Find)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="FindById"></a>

## FindById ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
Database Interface MongoDB Helper FindById class

**Kind**: global class  
**Extends:** <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [FindById](#FindById) ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
    * *[._validate(context)](#FindById+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#FindById+_process)
    * *[._validate(context)](#FindById+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#FindById+_process)
    * [._ack(context)](#BaseHelper+_ack)

<a name="FindById+_validate"></a>

### *findById._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates Query Execution Model fields

**Kind**: instance abstract method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="FindById+_process"></a>

### findById._process(context)
Process the context

**Kind**: instance method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="FindById+_validate"></a>

### *findById._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="FindById+_process"></a>

### findById._process(context)
Process the context

**Kind**: instance method of <code>[FindById](#FindById)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_ack"></a>

### findById._ack(context)
Acknowledge a Context

**Kind**: instance method of <code>[FindById](#FindById)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | the Context to acknowledge |

<a name="InsertOne"></a>

## InsertOne ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
Database Interface MongoDB Helper InsertOne class

**Kind**: global class  
**Extends:** <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [InsertOne](#InsertOne) ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
    * *[._validate(context)](#InsertOne+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#InsertOne+_process)

<a name="InsertOne+_validate"></a>

### *insertOne._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[InsertOne](#InsertOne)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="InsertOne+_process"></a>

### insertOne._process(context)
Process the context

**Kind**: instance method of <code>[InsertOne](#InsertOne)</code>  
**Overrides:** <code>[_process](#BaseDBInterfaceHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="UpdateOne"></a>

## UpdateOne ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
Database Interface MongoDB Helper UpdateOne class

**Kind**: global class  
**Extends:** <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [UpdateOne](#UpdateOne) ⇐ <code>[BaseDBInterfaceHelper](#BaseDBInterfaceHelper)</code>
    * *[._validate(context)](#UpdateOne+_validate) ⇒ <code>Promise</code>*
    * [._process(context)](#UpdateOne+_process)

<a name="UpdateOne+_validate"></a>

### *updateOne._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this HelperValidates abstract query fields

**Kind**: instance abstract method of <code>[UpdateOne](#UpdateOne)</code>  
**Overrides:** <code>[_validate](#BaseDBInterfaceHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="UpdateOne+_process"></a>

### updateOne._process(context)
Process the context

**Kind**: instance method of <code>[UpdateOne](#UpdateOne)</code>  
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
    * [.create(req, res, next)](#ExecutionsHandler+create)
    * [.update(req, res, next)](#ExecutionsHandler+update)
    * [.findById(req, res, next)](#ExecutionsHandler+findById)
    * [.delete(req, res, next)](#ExecutionsHandler+delete)
    * [.find(req, res, next)](#ExecutionsHandler+find)

<a name="new_ExecutionsHandler_new"></a>

### new ExecutionsHandler(cementHelper)

| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper from a cta-restapi Brick |

<a name="ExecutionsHandler+create"></a>

### executionsHandler.create(req, res, next)
Publishes request body (Execution) in an execution-create Context

**Kind**: instance method of <code>[ExecutionsHandler](#ExecutionsHandler)</code>  

| Param |
| --- |
| req | 
| res | 
| next | 

<a name="ExecutionsHandler+update"></a>

### executionsHandler.update(req, res, next)
Publishes request body (Execution) in an execution-update Context

**Kind**: instance method of <code>[ExecutionsHandler](#ExecutionsHandler)</code>  

| Param |
| --- |
| req | 
| res | 
| next | 

<a name="ExecutionsHandler+findById"></a>

### executionsHandler.findById(req, res, next)
Publishes request params (Query) id in an execution-findbyid Context

**Kind**: instance method of <code>[ExecutionsHandler](#ExecutionsHandler)</code>  

| Param |
| --- |
| req | 
| res | 
| next | 

<a name="ExecutionsHandler+delete"></a>

### executionsHandler.delete(req, res, next)
Publishes request params (Query) id in an execution-deleteone Context

**Kind**: instance method of <code>[ExecutionsHandler](#ExecutionsHandler)</code>  

| Param |
| --- |
| req | 
| res | 
| next | 

<a name="ExecutionsHandler+find"></a>

### executionsHandler.find(req, res, next)
Publishes request params (Query) in an execution-find Context

**Kind**: instance method of <code>[ExecutionsHandler](#ExecutionsHandler)</code>  

| Param |
| --- |
| req | 
| res | 
| next | 

