// Created by inigo quilez - iq/2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


// Normals are analytical (true derivatives) for the terrain and for the clouds, that 
// includes the noise, the fbm and the smoothsteps involved chain derivatives correctly.
//
// See here for more info: http://iquilezles.org/www/articles/morenoise/morenoise.htm
//
// Lighting and art composed for this shot/camera
//
// The trees are really cheap (ellipsoids with noise), but they kind of do the job in
// distance and low image resolutions.
//
// I used some cheap reprojection technique to smooth out the render, although it creates
// halows and blurs the image way too much (I don't have the time now to do the tricks
// used in TAA). Enable the STATIC_CAMERA define to see a sharper image.
//
// Lastly, it runs very slow in WebGL (but runs 2x faster in native GL), so I had to make
// a youtube capture, sorry for that!
// 
// https://www.youtube.com/watch?v=VqYROPZrDeU


//#define STATIC_CAMERA
#define LOWQUALITY


//==========================================================================================
// general utilities
//==========================================================================================

float sdEllipsoidY( in vec3 p, in vec2 r )
{
    float k0 = length(p/r.xyx);
    float k1 = length(p/(r.xyx*r.xyx));
    return k0*(k0-1.0)/k1;
}

// return smoothstep and its derivative
vec2 smoothstepd( float a, float b, float x)
{
    if( x<a ) return vec2( 0.0, 0.0 );
    if( x>b ) return vec2( 1.0, 0.0 );
    float ir = 1.0/(b-a);
    x = (x-a)*ir;
    return vec2( x*x*(3.0-2.0*x), 6.0*x*(1.0-x)*ir );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
    vec3 cw = normalize(ta-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

//==========================================================================================
// hashes
//==========================================================================================

float hash1( vec2 p )
{
    p  = 50.0*fract( p*0.3183099 );
    return fract( p.x*p.y*(p.x+p.y) );
}

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

vec2 hash2( float n ) { return fract(sin(vec2(n,n+1.0))*vec2(43758.5453123,22578.1459123)); }


vec2 hash2( vec2 p ) 
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    p = p*k + k.yx;
    return fract( 16.0 * k*fract( p.x*p.y*(p.x+p.y)) );
}

//==========================================================================================
// noises
//==========================================================================================

// value noise, and its analytical derivatives
vec4 noised( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
    float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return vec4( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z), 
                        2.0* du * vec3( k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                                        k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                                        k3 + k6*u.x + k5*u.y + k7*u.x*u.y ) );
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    
    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
    float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}

vec3 noised( in vec2 x )
{
    vec2 p = floor(x);
    vec2 w = fract(x);
    
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec2 du = 30.0*w*w*(w*(w-2.0)+1.0);
    
    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));

    float k0 = a;
    float k1 = b - a;
    float k2 = c - a;
    float k4 = a - b - c + d;

    return vec3( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k4*u.x*u.y), 
                        2.0* du * vec2( k1 + k4*u.y,
                                        k2 + k4*u.x ) );
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 w = fract(x);
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    
#if 0
    p *= 0.3183099;
    float kx0 = 50.0*fract( p.x );
    float kx1 = 50.0*fract( p.x+0.3183099 );
    float ky0 = 50.0*fract( p.y );
    float ky1 = 50.0*fract( p.y+0.3183099 );

    float a = fract( kx0*ky0*(kx0+ky0) );
    float b = fract( kx1*ky0*(kx1+ky0) );
    float c = fract( kx0*ky1*(kx0+ky1) );
    float d = fract( kx1*ky1*(kx1+ky1) );
#else
    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));
#endif
    
    return -1.0+2.0*( a + (b-a)*u.x + (c-a)*u.y + (a - b - c + d)*u.x*u.y );
}

//==========================================================================================
// fbm constructions
//==========================================================================================

const mat3 m3  = mat3( 0.00,  0.80,  0.60,
                        -0.80,  0.36, -0.48,
                        -0.60, -0.48,  0.64 );
const mat3 m3i = mat3( 0.00, -0.80, -0.60,
                        0.80,  0.36, -0.48,
                        0.60, -0.48,  0.64 );
const mat2 m2 = mat2(  0.80,  0.60,
                        -0.60,  0.80 );
const mat2 m2i = mat2( 0.80, -0.60,
                        0.60,  0.80 );

//------------------------------------------------------------------------------------------

float fbm_4( in vec3 x )
{
    float f = 2.0;
    float s = 0.5;
    float a = 0.0;
    float b = 0.5;
    for( int i=0; i<4; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m3*x;
    }
    return a;
}

vec4 fbmd_8( in vec3 x )
{
    float f = 1.92;
    float s = 0.5;
    float a = 0.0;
    float b = 0.5;
    vec3  d = vec3(0.0);
    mat3  m = mat3(1.0,0.0,0.0,
                    0.0,1.0,0.0,
                    0.0,0.0,1.0);
    for( int i=0; i<7; i++ )
    {
        vec4 n = noised(x);
        a += b*n.x;          // accumulate values		
        d += b*m*n.yzw;      // accumulate derivatives
        b *= s;
        x = f*m3*x;
        m = f*m3i*m;
    }
    return vec4( a, d );
}

float fbm_9( in vec2 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    for( int i=0; i<9; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m2*x;
    }
    return a;
}

vec3 fbmd_9( in vec2 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    vec2  d = vec2(0.0);
    mat2  m = mat2(1.0,0.0,0.0,1.0);
    for( int i=0; i<9; i++ )
    {
        vec3 n = noised(x);
        a += b*n.x;          // accumulate values		
        d += b*m*n.yz;       // accumulate derivatives
        b *= s;
        x = f*m2*x;
        m = f*m2i*m;
    }
    return vec3( a, d );
}

float fbm_4( in vec2 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    for( int i=0; i<4; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m2*x;
    }
    return a;
}

//==========================================================================================

#define ZERO (min(iFrame,0))


//==========================================================================================
// specifics to the actual painting
//==========================================================================================


//------------------------------------------------------------------------------------------
// global
//------------------------------------------------------------------------------------------

const vec3  kSunDir = vec3(-0.624695,0.468521,-0.624695);
const float kMaxTreeHeight = 2.0;
const float kMaxHeight = 120.0;

vec3 fog( in vec3 col, float t )
{
    vec3 fogCol = vec3(0.4,0.6,1.15);
    return mix( col, fogCol, 1.0-exp(-0.000001*t*t) );
}


//------------------------------------------------------------------------------------------
// trees
//------------------------------------------------------------------------------------------

float treesMap( in vec3 p, in float rt, out float oHei, out float oMat, out float oDis )
{
    oHei = 1.0;
    oDis = 0.1;
    oMat = 0.0;
        
    float base = terrainMap(p.xz).x; 
    
    float d = 10.0;
    vec2 n = floor( p.xz );
    vec2 f = fract( p.xz );
    for( int j=0; j<=1; j++ )
    for( int i=0; i<=1; i++ )
    {
        vec2  g = vec2( float(i), float(j) ) - step(f,vec2(0.5));
        vec2  o = hash2( n + g );
        vec2  v = hash2( n + g + vec2(13.1,71.7) );
        vec2  r = g - f + o;

        float height = kMaxTreeHeight * (0.4+0.8*v.x);
        float width = 0.9*(0.5 + 0.2*v.x + 0.3*v.y);
        vec3  q = vec3(r.x,p.y-base-height*0.5,r.y);
        float k = sdEllipsoidY( q, vec2(width,0.5*height) );

        if( k<d )
        { 
            d = k;
            //oMat = hash1(o); //fract(o.x*7.0 + o.y*15.0);
            oMat = o.x*7.0 + o.y*15.0;
            oHei = (p.y - base)/height;
            oHei *= 0.5 + 0.5*length(q) / width;
        }
    }
    oMat = fract(oMat);

    // distort ellipsoids to make them look like trees (works only in the distance really)
    #ifdef LOWQUALITY
    if( rt<350.0 )
    #else
    if( rt<500.0 )
    #endif
    {
        float s = fbm_4( p*3.0 );
        s = s*s;
        oDis = s;
        #ifdef LOWQUALITY
        float att = 1.0-smoothstep(150.0,350.0,rt);
        #else
        float att = 1.0-smoothstep(200.0,500.0,rt);
        #endif
        d += 2.0*s*att*att;
    }
    
    return d;
}

float treesShadow( in vec3 ro, in vec3 rd )
{
    float res = 1.0;
    float t = 0.02;
#ifdef LOWQUALITY
    for( int i=ZERO; i<50; i++ )
    {
        float kk1, kk2, kk3;
        vec3 pos = ro + rd*t;
        float h = treesMap( pos, t, kk1, kk2, kk3 );
        res = min( res, 32.0*h/t );
        t += h;
        if( res<0.001 || t>20.0 ) break;
    }
#else
    for( int i=ZERO; i<150; i++ )
    {
        float kk1, kk2, kk3;
        float h = treesMap( ro + rd*t, t, kk1, kk2, kk3 );
        res = min( res, 32.0*h/t );
        t += h;
        if( res<0.001 || t>120.0 ) break;
    }
#endif
    return clamp( res, 0.0, 1.0 );
}

vec3 treesNormal( in vec3 pos, in float t )
{
    float kk1, kk2, kk3;
#if 0    
    const float eps = 0.005;
    vec2 e = vec2(1.0,-1.0)*0.5773*eps;
    return normalize( e.xyy*treesMap( pos + e.xyy, t, kk1, kk2, kk3 ) + 
                        e.yyx*treesMap( pos + e.yyx, t, kk1, kk2, kk3 ) + 
                        e.yxy*treesMap( pos + e.yxy, t, kk1, kk2, kk3 ) + 
                        e.xxx*treesMap( pos + e.xxx, t, kk1, kk2, kk3 ) );            
#else
    // inspired by tdhooper and klems - a way to prevent the compiler from inlining map() 4 times
    vec3 n = vec3(0.0);
    for( int i=ZERO; i<4; i++ )
    {
        vec3 e = 0.5773*(2.0*vec3((((i+3)>>1)&1),((i>>1)&1),(i&1))-1.0);
        n += e*treesMap(pos+0.005*e, t, kk1, kk2, kk3);
    }
    return normalize(n);
#endif    
}

vec3 treesShade( in vec3 pos, in vec3 tnor, in vec3 enor, in float hei, in float mid, in float dis, in float rt, in vec3 rd, float terrainShadow )
{
    vec3 nor = normalize( tnor + 2.5*enor );

    // --- lighting ---
    float sha = terrainShadow;
    vec3  ref = reflect(rd,nor);
    float occ = clamp(hei,0.0,1.0) * pow(1.0-2.0*dis,3.0);
    float dif = clamp( 0.1 + 0.9*dot( nor, kSunDir), 0.0, 1.0 ); 
    if( dif>0.0001 && terrainShadow>0.001 )
    {
        //sha *= clamp( 10.0*dot(tnor,kSunDir), 0.0, 1.0 ) * pow(clamp(1.0-13.0*dis,0.0,1.0),4.0);//treesShadow( pos+nor*0.1, kSunDir ); // only cast in non-terrain-occluded areas
        sha *= treesShadow( pos+nor*0.1, kSunDir ); // only cast in non-terrain-occluded areas
    }
    float dom = clamp( 0.5 + 0.5*nor.y, 0.0, 1.0 );
    float fre = clamp(1.0+dot(nor,rd),0.0,1.0);
    float spe = pow( clamp(dot(ref,kSunDir),0.0, 1.0), 9.0 )*dif*sha*(0.2+0.8*pow(fre,5.0))*occ;

    // --- lights ---
    vec3 lin  = 1.0*0.5*mix(0.1*vec3(0.1,0.2,0.0),vec3(0.6,1.0,1.0),dom*occ);
        #ifdef SOFTTREES
            lin += 1.0*15.0*vec3(1.0,0.9,0.8)*dif*occ*sha;
        #else
            lin += 1.0*10.0*vec3(1.0,0.9,0.8)*dif*occ*sha;
        #endif
            lin += 1.0*vec3(0.9,1.0,0.8)*pow(fre,5.0)*occ;
            lin += 0.05*vec3(0.15,0.4,0.1)*occ;
    
    // --- material ---
    float brownAreas = fbm_4( pos.zx*0.03 );
    vec3 col = vec3(0.08,0.09,0.02);
        col = mix( col, vec3(0.09,0.07,0.02), smoothstep(0.2,1.0,mid) );
            col = mix( col, vec3(0.06,0.05,0.01)*1.1, 1.0-smoothstep(0.9,0.91,enor.y) );
            col = mix( col, vec3(0.25,0.16,0.01)*0.15, 0.7*smoothstep(0.1,0.3,brownAreas)*smoothstep(0.5,0.8,enor.y) );
            col *= 1.6;

    // --- brdf * material ---
    col *= lin;
    col += spe*1.2*vec3(1.0,1.1,2.5);

    // --- fog ---
    col = fog( col, rt );
    
    return col;
}

vec4 renderTrees( in vec3 ro, in vec3 rd, float tmin, float tmax, float terrainShadow, inout float resT )
{
    //if( tmin>300.0 ) return vec4(0.0);
    float t = tmin;
    float hei, mid, displa;

    for(int i=ZERO; i<64; i++) 
    { 
        vec3  pos = ro + t*rd; 
        float dis = treesMap( pos, t, hei, mid, displa); 
        if( dis<(0.00025*t) ) break;
        t += dis;
        if( t>tmax ) return vec4(0.0);
    }
    
    vec3 pos = ro + t*rd;

    vec3 enor = terrainNormal( pos.xz );
    vec3 tnor = treesNormal( pos, t );            

    vec3 col = treesShade( pos, tnor, enor, hei, mid, displa, t, rd, terrainShadow );
    resT = t;
    
    return vec4(col,1.0);
}


//------------------------------------------------------------------------------------------
// main image making function
//------------------------------------------------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 o = hash2( 0.0 ) - 0.5;
    
    vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/ iResolution.y;
    
    //----------------------------------
    // setup
    //----------------------------------

    // camera
    float time = 0.0;

    vec3 ro = vec3(0.0, -99.25, 5.0) + vec3(10.0*sin(0.02*time),0.0,-10.0*sin(0.2+0.031*time));
    vec3 ta = vec3(0.0, -98.25, -45.0 + ro.z );
    
    // ray
    mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = ca * normalize( vec3(p,1.5));

    float resT = 1000.0;

    //----------------------------------
    // sky
    //----------------------------------

    vec3 col = vec3(0.0, -98.25, -45.0 + ro.z );
    
    //----------------------------------
    // terrain
    //----------------------------------
    vec2 teDistance;
    float teShadow;
    
    vec2 tmima = vec2(15.0,1000.0);
                

    //----------------------------------
    // trees
    //----------------------------------
    
    {
        tmima = vec2( teDistance.y, (teDistance.x>0.0)?teDistance.x:tmima.y );
        vec4 res = renderTrees( ro, rd, tmima.x, tmima.y, teShadow, resT );
        col = col*(1.0-res.w) + res.xyz;
    }
    
    //----------------------------------
    // final
    //----------------------------------
   
    // gamma
    col = sqrt(col);

    //----------------------------------
    // color grading
    //----------------------------------

    
    
    
    
        fragColor = vec4( col, 1.0 );
    
}